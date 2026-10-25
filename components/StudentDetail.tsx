import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { 
  PhoneIcon, WhatsappIcon, CopyIcon, ArrowRightIcon, 
  CakeIcon, CheckIcon, UserPlusIcon, ShareIcon 
} from './Icons';
import Avatar from './Avatar';
import ImageLightbox from './ImageLightbox';
import { APP_CONFIG } from '../constants';

interface StudentDetailProps {
  students: Student[];
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ students }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const found = students.find((s) => s.id === id);
    setStudent(found || null);
  }, [id, students]);

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-stone-950 text-stone-500">
        טוען פרטי תלמיד...
      </div>
    );
  }

  const handleCall = () => {
    if (!student.phone_number) return;
    window.location.href = `tel:${student.phone_number}`;
  };

  const handleWhatsApp = () => {
    if (!student.phone_number) return;
    let cleanNum = student.phone_number.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '972' + cleanNum.substring(1);
    }
    window.open(`https://wa.me/${cleanNum}`, '_blank');
  };

  const handleCopy = () => {
    if (!student.phone_number) return;
    navigator.clipboard.writeText(student.phone_number).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const handleShare = async () => {
    if (!student) return;
    const shareText = [
      student.full_name,
      student.phone_number
    ].filter(Boolean).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: student.full_name,
          text: shareText,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // המשתמש ביטל את תפריט השיתוף
      }
    }

    // Fallback: העתקה ללוח והצגת חיווי ברור
    try {
      await navigator.clipboard.writeText(shareText);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2400);
    } catch (e) {
      console.warn("Failed to copy to clipboard for share:", e);
    }
  };

  const handleSaveContact = () => {
    if (!student) return;
    const cleanPhone = student.phone_number ? student.phone_number.trim() : '';
    const noteText = `${student.class ? `${student.class} - ` : ''}מכינת בית אל`;
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN;CHARSET=UTF-8:${student.full_name}`,
      `N;CHARSET=UTF-8:${student.full_name};;;;`,
      cleanPhone ? `TEL;TYPE=CELL,VOICE:${cleanPhone}` : '',
      `NOTE;CHARSET=UTF-8:${noteText}`,
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    // הוספת BOM (\uFEFF) יחד עם הגדרת CHARSET=UTF-8 מבטיחה תצוגה נקייה ללא ג'יבריש בעברית
    const blob = new Blob(['\uFEFF' + vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${student.full_name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* מודאל תמונה מוגדלת (Lightbox) */}
      <ImageLightbox
        student={isLightboxOpen ? student : null}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* סרגל ניווט עליון */}
      <header className="bg-[#FAF8F5]/90 dark:bg-stone-950/90 backdrop-blur-md px-4 py-3.5 border-b border-stone-200/80 dark:border-stone-800 flex items-center gap-3 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300 active:scale-95"
          aria-label="חזרה לרשימה"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 font-heading">
          פרטי איש קשר
        </h2>
      </header>

      {/* גוף העמוד */}
      <main className="flex-1 px-5 py-6 flex flex-col items-center max-w-md mx-auto w-full animate-fadeIn pb-24 relative">
        {/* הודעת חיווי צפה בעת שיתוף/העתקה */}
        {shareFeedback && (
          <div className="fixed top-16 z-50 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
            <CheckIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>הועתק לשיתוף!</span>
          </div>
        )}

        {/* 1. Hero Section: תמונת פרופיל מוגדלת וכותרת */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="relative mb-4 cursor-zoom-in group active:scale-95 transition-transform"
          title="לחץ להגדלת תמונה"
        >
          <Avatar 
            name={student.full_name}
            imageUrl={student.image_url}
            sizeClassName="w-28 h-28 sm:w-32 sm:h-32 text-3xl sm:text-4xl"
            className="ring-4 ring-stone-200/90 dark:ring-stone-800 shadow-xl"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900 dark:text-stone-100 text-center mb-2 leading-tight">
          {student.full_name}
        </h1>

        {student.class && (
          <span className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 px-4 py-1 rounded-full mb-6 shadow-xs">
            {student.class}
          </span>
        )}

        {/* 2. פיצול כפתורים להיררכיה ברורה */}
        <div className="w-full space-y-2.5 mb-6">
          {/* שתי פעולות ראשיות (Hero Actions) - 50% כל אחת */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* חיוג מיידי */}
            <button 
              onClick={handleCall}
              className="py-3.5 px-4 rounded-2xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 font-semibold text-sm"
              title="חיוג מיידי"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>חיוג</span>
            </button>

            {/* וואטסאפ */}
            <button 
              onClick={handleWhatsApp}
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 font-semibold text-sm"
              title="שליחת הודעה בוואטסאפ"
            >
              <WhatsappIcon className="w-5 h-5" />
              <span>וואטסאפ</span>
            </button>
          </div>

          {/* שלוש פעולות משניות בשורה קומפקטית שווה */}
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {/* העתקת מספר */}
            <button 
              onClick={handleCopy}
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/90 shadow-sm active:scale-95 hover:border-stone-300 dark:hover:border-stone-700 transition-all text-stone-700 dark:text-stone-300"
              title="העתק מספר טלפון"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                {copyFeedback ? <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="w-4 h-4" />}
              </div>
              <span className="text-[11px] font-medium">
                {copyFeedback ? 'הועתק!' : 'העתק מספר'}
              </span>
            </button>

            {/* שתף איש קשר */}
            <button 
              onClick={handleShare}
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/90 shadow-sm active:scale-95 hover:border-stone-300 dark:hover:border-stone-700 transition-all text-stone-700 dark:text-stone-300"
              title="שתף איש קשר"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
                {shareFeedback ? <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ShareIcon className="w-4 h-4" />}
              </div>
              <span className="text-[11px] font-medium">
                {shareFeedback ? 'שותף!' : 'שתף איש קשר'}
              </span>
            </button>

            {/* שמור לטלפון */}
            <button 
              onClick={handleSaveContact}
              className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/90 shadow-sm active:scale-95 hover:border-stone-300 dark:hover:border-stone-700 transition-all text-stone-700 dark:text-stone-300"
              title="שמור לטלפון (vCard)"
            >
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                <UserPlusIcon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">שמור לטלפון</span>
            </button>
          </div>
        </div>

        {/* 3. כרטיס מידע מרכזי מאוחד (Unified Info Card) */}
        <div className="w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800/90 shadow-sm overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/80">
          {/* שורת טלפון */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="text-right flex-1 min-w-0">
              <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block mb-0.5">
                מספר טלפון
              </span>
              <p className="font-mono text-lg font-bold text-stone-900 dark:text-stone-100 dir-ltr text-right truncate">
                {student.phone_number || 'לא מוגדר'}
              </p>
            </div>
            {student.phone_number && (
              <div className="flex items-center gap-1 shrink-0">
                <button 
                  onClick={handleCopy}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors active:scale-90"
                  title="העתק מספר"
                  aria-label="העתק מספר טלפון"
                >
                  {copyFeedback ? <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleCall}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors active:scale-90"
                  title="חיוג"
                  aria-label="חיוג למספר"
                >
                  <PhoneIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* שורת יום הולדת עברי */}
          {student.birthday_hebrew && (
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="text-right flex-1 min-w-0">
                <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block mb-0.5">
                  תאריך יום הולדת עברי
                </span>
                <p className="text-base font-semibold text-amber-600 dark:text-amber-400 truncate">
                  {student.birthday_hebrew}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CakeIcon className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* שורת הערות ותפקיד */}
          {student.notes && (
            <div className="p-4 text-right">
              <span className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block mb-1">
                הערות ותפקיד
              </span>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {student.notes}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDetail;
