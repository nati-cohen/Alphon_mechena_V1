import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { SearchIcon, XIcon, MenuIcon, PhoneIcon, WhatsappIcon, CakeIcon } from './Icons';
import { APP_CONFIG } from '../constants';
import Sidebar from './Sidebar';
import Avatar from './Avatar';
import ImageLightbox from './ImageLightbox';
import { 
  getCurrentHebrewDateInfo, 
  isBirthdayMonthMatch 
} from '../utils/hebrewDate';

interface StudentListProps {
  students: Student[];
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cardScaleLevel: number;
  onScaleChange: (level: number) => void;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

// נרמול בסיסי של טקסט עברי: הסרת ניקוד, גרשיים, מקפים והמרת אותיות סופיות
function normalizeHebrewBasic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u0591-\u05C7]/g, '') // הסרת ניקוד
    .replace(/[\u05F3\u05F4'"`״׳\-–—.,/\\()[\]{}!?:;]/g, '') // הסרת סימני פיסוק וגרשיים
    .replace(/ך/g, 'כ')
    .replace(/ם/g, 'מ')
    .replace(/ן/g, 'נ')
    .replace(/ף/g, 'פ')
    .replace(/ץ/g, 'צ')
    .replace(/וו+/g, 'ו')
    .replace(/יי+/g, 'י')
    .trim();
}

// נרמול שמות נפוצים עם כתיב מלא וחסר (ללא מחיקה גורפת של אותיות)
function canonicalHebrewName(text: string): string {
  return text
    .replace(/^יהונתן$/, 'יונתן')
    .replace(/^אלעזר$/, 'אליעזר')
    .replace(/^אראל$/, 'אריאל')
    .replace(/^דויד$/, 'דוד');
}

// אלגוריתם לוינשטיין קל-משקל לסובלנות שגיאות כתיב והקלדה
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: a.length + 1 }, (_, i) => i);
  for (let i = 1; i <= b.length; i++) {
    let prev = i;
    for (let j = 1; j <= a.length; j++) {
      const temp = row[j];
      if (b[i - 1] === a[j - 1]) {
        row[j] = row[j - 1];
      } else {
        row[j] = Math.min(row[j] + 1, prev + 1, row[j - 1] + 1);
      }
      prev = temp;
    }
    row[0] = i;
  }
  return row[a.length];
}

// בדיקת התאמת מילת חיפוש מול מילת יעד בדיוק גבוה ובלי תוצאות שווא
function isWordMatch(token: string, word: string): boolean {
  if (!token || !word) return false;

  // 1. התאמת תת-מחרוזת ישירה (למשל "משה" בתוך "משה", "כה" בתוך "כהן")
  if (word.includes(token)) return true;

  // 2. נרמול שמות נרדפים ידועים (כתיב מלא/חסר: יהונתן ↔ יונתן)
  const canonToken = canonicalHebrewName(token);
  const canonWord = canonicalHebrewName(word);
  if (canonWord.includes(canonToken) || canonToken.includes(canonWord)) return true;

  // 3. כתיב מלא וחסר מבוקר (הבדל של אות ו/י אחת בתוך המילה, באות ראשונה זהה בלבד)
  if (
    token.length >= 4 &&
    word.length >= 4 &&
    token[0] === word[0] &&
    Math.abs(token.length - word.length) <= 1
  ) {
    const stripVowels = (s: string) => s[0] + s.slice(1).replace(/[וי]/g, '');
    if (stripVowels(token) === stripVowels(word)) {
      return true;
    }
  }

  // 4. סובלנות לשגיאת הקלדה אחת (Levenshtein = 1) - אך ורק למילים באורך 5 אותיות ומעלה
  //    וחובה שהאות הראשונה תהיה זהה לחלוטין (כדי למנוע לחלוטין התאמות שגויות בין שמות קצרים כמו "משה" ו-"ישי")
  if (token.length >= 5 && word.length >= 5 && token[0] === word[0]) {
    if (Math.abs(token.length - word.length) <= 1 && levenshtein(token, word) <= 1) {
      return true;
    }
    // תחילית במילה ארוכה יותר
    if (word.length > token.length) {
      const wordPrefix = word.slice(0, token.length);
      if (levenshtein(token, wordPrefix) <= 1) {
        return true;
      }
    }
  }

  return false;
}

// בדיקת התאמת טוקן חיפוש מול מילות המטרה של התלמיד
function matchesQueryToken(token: string, targetWords: string[]): boolean {
  const normToken = normalizeHebrewBasic(token);
  if (!normToken) return true;

  for (const word of targetWords) {
    const normWord = normalizeHebrewBasic(word);
    if (!normWord) continue;

    if (isWordMatch(normToken, normWord)) {
      return true;
    }
  }

  return false;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  selectedClass, 
  setSelectedClass, 
  searchQuery, 
  setSearchQuery,
  cardScaleLevel,
  onScaleChange,
  onRefresh,
  isRefreshing = false
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lightboxStudent, setLightboxStudent] = useState<Student | null>(null);

  // מנגנון משיכה לרענון (Pull to Refresh)
  const mainRef = useRef<HTMLElement>(null);
  const [pullY, setPullY] = useState(0);
  const [isInternalRefreshing, setIsInternalRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const isPullingRef = useRef(false);
  const hasVibratedRef = useRef(false);

  const refreshing = isRefreshing || isInternalRefreshing;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (refreshing) return;
    const scrollTop = mainRef.current ? mainRef.current.scrollTop : 0;
    if (scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      isPullingRef.current = true;
      hasVibratedRef.current = false;
    } else {
      isPullingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || refreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    const scrollTop = mainRef.current ? mainRef.current.scrollTop : 0;
    if (scrollTop <= 0 && diff > 0) {
      // התנגדות קפיצית
      const pull = Math.min(80, diff * 0.42);
      setPullY(pull);

      if (pull >= 52 && !hasVibratedRef.current) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(15);
          } catch {
            // ignore
          }
        }
        hasVibratedRef.current = true;
      }
    } else {
      setPullY(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current || refreshing) return;
    isPullingRef.current = false;

    if (pullY >= 52 && onRefresh) {
      setIsInternalRefreshing(true);
      setPullY(48); // החזקת המחוון פעיל בעת סנכרון
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([10, 25]);
        } catch {
          // ignore
        }
      }
      try {
        await onRefresh();
      } finally {
        setIsInternalRefreshing(false);
        setPullY(0);
      }
    } else {
      setPullY(0);
    }
  };

  const dateInfo = useMemo(() => getCurrentHebrewDateInfo(), []);

  const classes = useMemo(() => {
    const uniqueClasses = new Set(students.map(s => s.class).filter(Boolean));
    return ['all', ...Array.from(uniqueClasses).sort()];
  }, [students]);

  // מנגנון חיפוש גמיש (Fuzzy Search) מותאם עברית
  const filteredStudents = useMemo(() => {
    const query = (searchQuery || '').trim();
    if (!query) {
      return selectedClass === 'all' 
        ? students 
        : students.filter(s => s.class === selectedClass);
    }

    const cleanQueryDigits = query.replace(/\D/g, '');
    const tokens = query.split(/\s+/).filter(Boolean);

    return students.filter((student) => {
      // סינון לפי מחזור/כיתה
      if (selectedClass !== 'all' && student.class !== selectedClass) {
        return false;
      }

      // חיפוש ספרות נקי למספרי טלפון
      if (cleanQueryDigits.length >= 3) {
        const studentPhoneClean = (student.phone_number || '').replace(/\D/g, '');
        if (studentPhoneClean.includes(cleanQueryDigits)) return true;
      }

      // מילות המטרה מתוך פרטי התלמיד
      const studentWords = [
        ...(student.full_name || '').split(/\s+/),
        student.class || '',
        ...(student.notes || '').split(/\s+/)
      ].filter(Boolean);

      // כל מילת חיפוש חייבת להתאים
      return tokens.every(token => {
        const tokenDigits = token.replace(/\D/g, '');
        if (tokenDigits.length >= 3) {
          const studentPhoneClean = (student.phone_number || '').replace(/\D/g, '');
          if (studentPhoneClean.includes(tokenDigits)) return true;
        }
        return matchesQueryToken(token, studentWords);
      });
    });
  }, [students, searchQuery, selectedClass]);

  // פתיחת וואטסאפ ללא מעבר לעמוד
  const handleWhatsAppClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    let cleanNum = phone.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '972' + cleanNum.substring(1);
    }
    window.open(`https://wa.me/${cleanNum}`, '_blank');
  };

  // חיוג טלפוני ללא מעבר לעמוד
  const handleCallClick = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  // הגדלת תמונה בלחיצה ישירה מהכרטיס ללא מעבר לעמוד
  const handleAvatarClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setLightboxStudent(student);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        cardScaleLevel={cardScaleLevel}
        onScaleChange={onScaleChange}
      />

      {/* מודאל תמונה בגודל מלא (Lightbox) */}
      <ImageLightbox 
        student={lightboxStudent} 
        onClose={() => setLightboxStudent(null)} 
      />
      
      {/* סרגל עליון מקובע */}
      <header className="flex-shrink-0 bg-[#FAF8F5]/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 pt-[calc(0.875rem+env(safe-area-inset-top,0px))] pb-3 space-y-3 z-10">
        <div className="flex items-center justify-between relative min-h-[44px]">
          {/* כפתור תפריט צד */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="w-10 h-10 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl transition-colors active:scale-95"
            aria-label="תפריט"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          {/* כותרת המכינה ותאריך עברי */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-xl font-heading font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
              {APP_CONFIG.NAME}
            </h1>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5 tracking-wide">
              {dateInfo.fullFormatted}
            </p>
          </div>

          <div className="w-10" aria-hidden="true" />
        </div>

        {/* שורת חיפוש מהירה וסובלנית לשגיאות */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="חיפוש לפי שם , טלפון..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 rounded-xl py-2.5 pr-10 pl-9 text-sm outline-none border border-stone-200 dark:border-stone-800 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 transition-all text-right shadow-sm" 
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none">
            <SearchIcon className="w-4 h-4" />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1"
              aria-label="נקה חיפוש"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* טאבים לסינון כיתות/מחזורים */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5 items-center">
          {classes.map((cls) => {
            const isSelected = selectedClass === cls;
            return (
              <button 
                key={cls} 
                onClick={() => setSelectedClass(cls)} 
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected 
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm' 
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200/90 dark:border-stone-800 hover:bg-stone-100/70 dark:hover:bg-stone-800'
                }`}
              >
                {cls === 'all' ? 'כל התלמידים' : cls}
              </button>
            );
          })}
        </div>
      </header>

      {/* רשימת תלמידים נגללת עם תמיכה במשיכה לרענון */}
      <main 
        ref={mainRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] no-scrollbar overscroll-contain"
      >
        {/* מחוון משיכה לרענון (Pull to Refresh Indicator) */}
        <div 
          className="overflow-hidden transition-all duration-200 flex items-center justify-center pointer-events-none"
          style={{ 
            height: refreshing || pullY > 0 ? `${Math.max(pullY, refreshing ? 48 : 0)}px` : '0px',
            opacity: refreshing || pullY > 0 ? 1 : 0
          }}
        >
          <div className="flex items-center gap-2 py-2 text-stone-600 dark:text-stone-300">
            <div 
              className={`w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-700 border-t-amber-600 transition-transform ${
                refreshing ? 'animate-spin' : ''
              }`}
              style={{
                transform: !refreshing ? `rotate(${pullY * 5}deg)` : undefined
              }}
            />
            <span className="text-xs font-medium">
              {refreshing ? 'מרענן נתונים מ-Google Sheets...' : pullY >= 52 ? 'שחרר לרענון' : 'משוך לרענון'}
            </span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center text-stone-500 dark:text-stone-400 py-16 px-4">
            <p className="text-base font-medium">לא נמצאו תלמידים התואמים לחיפוש</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">בדוק את האיות או נסה לסנן מחזור אחר</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isBirthday = isBirthdayMonthMatch(student.birthday_hebrew, dateInfo.monthName);
            
            return (
              <div 
                key={student.id} 
                onClick={() => navigate(`/student/${student.id}`)} 
                className="student-card bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800/90 shadow-sm hover:shadow hover:border-stone-300 dark:hover:border-stone-700 flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]"
              >
                {/* צד ימין: אווטאר/תמונה שניתנת להגדלה + פרטי התלמיד */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* לחיצה ישירה על האווטאר פותחת Lightbox */}
                  <div 
                    onClick={(e) => handleAvatarClick(e, student)}
                    className="relative flex-shrink-0 cursor-zoom-in active:scale-95 transition-transform"
                    title="הגדל תמונה"
                  >
                    <Avatar 
                      name={student.full_name} 
                      imageUrl={student.image_url} 
                      sizeClassName="w-12 h-12 text-sm"
                      className="shadow-sm ring-1 ring-stone-900/5 dark:ring-stone-100/10"
                    />
                    {isBirthday && (
                      <div 
                        className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 p-1 rounded-full shadow border-2 border-white dark:border-stone-900"
                        title="חוגג יום הולדת החודש!"
                      >
                        <CakeIcon className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* שם ומחזור */}
                  <div className="min-w-0 text-right">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-stone-900 dark:text-stone-100 truncate text-[15px] leading-tight">
                        {student.full_name}
                      </h3>
                      {isBirthday && (
                        <span className="birthday-tag text-amber-700 dark:text-amber-400 font-semibold px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/50 rounded text-[10px]">
                          מזל טוב
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {student.class && (
                        <span>{student.class}</span>
                      )}
                      {student.class && student.phone_number && (
                        <span aria-hidden="true">·</span>
                      )}
                      {student.phone_number && (
                        <span className="dir-ltr font-mono">{student.phone_number}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* צד שמאל: פעולות מהירות (חיוג מיידי + WhatsApp) */}
                <div className="flex items-center gap-1 shrink-0 mr-2" onClick={(e) => e.stopPropagation()}>
                  {student.phone_number && (
                    <>
                      <button 
                        onClick={(e) => handleCallClick(e, student.phone_number)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors active:scale-90"
                        title={`חייג אל ${student.full_name}`}
                        aria-label={`חייג אל ${student.full_name}`}
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={(e) => handleWhatsAppClick(e, student.phone_number)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors active:scale-90"
                        title={`שלח וואטסאפ ל${student.full_name}`}
                        aria-label={`שלח וואטסאפ ל${student.full_name}`}
                      >
                        <WhatsappIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default StudentList;
