
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { CakeIcon, ArrowRightIcon, ChevronLeftIcon } from './Icons';

// כלי עזר לניקוי תווים מיוחדים לצורך השוואה בטוחה
const normalize = (s: string) => s.replace(/['"״׳]/g, '').trim();

// המרת יום עברי למספר לצורך מיון תקין
const hebrewDayToNumber = (dayStr: string): number => {
  const normalized = normalize(dayStr);
  const gematriaMap: { [key: string]: number } = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
  };
  
  let sum = 0;
  for (const char of normalized) {
    if (gematriaMap[char]) {
      sum += gematriaMap[char];
    }
  }
  return sum;
};

const getHebrewGematria = (num: number): string => {
  if (num <= 0) return "";
  const n = num > 5000 ? num - 5000 : num;
  const units = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת"];
  
  let result = "";
  let tempNum = n;

  while (tempNum >= 400) {
    result += "ת";
    tempNum -= 400;
  }
  if (tempNum >= 100) {
    const h = Math.floor(tempNum / 100);
    result += hundreds[h];
    tempNum %= 100;
  }

  if (tempNum === 15) {
    result += "טו";
  } else if (tempNum === 16) {
    result += "טז";
  } else {
    if (tempNum >= 10) {
      result += tens[Math.floor(tempNum / 10)];
      tempNum %= 10;
    }
    if (tempNum > 0) result += units[tempNum];
  }

  if (result.length > 1) return result.slice(0, -1) + '״' + result.slice(-1);
  return result + '׳';
};

export const isBirthdayMatch = (studentBirthday: string | undefined, currentMonth: string): boolean => {
  if (!studentBirthday) return false;
  
  const bDay = normalize(studentBirthday);
  const curr = normalize(currentMonth);

  const isStudentAdarA = bDay.includes("אדר א");
  const isStudentAdarB = bDay.includes("אדר ב");
  const isStudentAdarPlain = bDay.includes("אדר") && !isStudentAdarA && !isStudentAdarB;

  if (curr === "אדר") {
    return isStudentAdarPlain || isStudentAdarA || isStudentAdarB;
  }
  
  if (curr === "אדר א") {
    return isStudentAdarA;
  }
  
  if (curr === "אדר ב") {
    return isStudentAdarB || isStudentAdarPlain;
  }

  return bDay.includes(curr);
};

interface BirthdayPageProps {
  students: Student[];
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
}

const BirthdayPage: React.FC<BirthdayPageProps> = ({ 
  students, 
  selectedClass, 
  setSelectedClass 
}) => {
  const navigate = useNavigate();

  const currentHebrewDate = useMemo(() => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(now);
    const dayVal = parseInt(parts.find(p => p.type === 'day')?.value || "0");
    const monthVal = parts.find(p => p.type === 'month')?.value || "";
    const yearVal = parseInt(parts.find(p => p.type === 'year')?.value || "0");
    const cleanMonth = monthVal.startsWith('ב') ? monthVal.substring(1) : monthVal;
    return `${getHebrewGematria(dayVal)} ${cleanMonth} ${getHebrewGematria(yearVal)}`;
  }, []);

  const currentMonthName = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' });
    const monthPart = formatter.format(new Date());
    return monthPart.startsWith('ב') ? monthPart.substring(1) : monthPart;
  }, []);

  const classes = useMemo(() => {
    const studentsWithBirthday = students.filter(student => isBirthdayMatch(student.birthday_hebrew, currentMonthName));
    const uniqueClasses = new Set(studentsWithBirthday.map(s => s.class).filter(Boolean));
    return ['all', ...Array.from(uniqueClasses).sort()];
  }, [students, currentMonthName]);

  const birthdayStudents = useMemo(() => {
    return students
      .filter(student => {
        const matchesMonth = isBirthdayMatch(student.birthday_hebrew, currentMonthName);
        const matchesClass = selectedClass === 'all' || student.class === selectedClass;
        return matchesMonth && matchesClass;
      })
      .sort((a, b) => {
        const dayA = (a.birthday_hebrew || "").split(/\s+/)[0];
        const dayB = (b.birthday_hebrew || "").split(/\s+/)[0];
        return hebrewDayToNumber(dayA) - hebrewDayToNumber(dayB);
      });
  }, [students, currentMonthName, selectedClass]);

  return (
    <div className="h-full bg-pink-50/20 dark:bg-gray-900 flex flex-col animate-fadeIn transition-colors duration-200 overflow-hidden">
      
      {/* אזור כותרת וסינון - פריט קבוע (flex-shrink-0) */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md border-b border-pink-100 dark:border-gray-700 z-30 transition-colors">
        <div className="p-4 space-y-3">
          {/* שורת כותרת */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
              <ArrowRightIcon className="w-6 h-6" />
            </button>
            <div className="text-right flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">ימי הולדת</h1>
              <p className="text-[12px] text-pink-600 dark:text-pink-400 font-bold tracking-wide">{currentHebrewDate}</p>
            </div>
            <div className="text-pink-500"><CakeIcon className="w-6 h-6" /></div>
          </div>

          {/* סינון מחזורים */}
          {classes.length > 2 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedClass === cls
                      ? 'bg-pink-500 text-white shadow-md scale-105'
                      : 'bg-white dark:bg-gray-700 border border-pink-100 dark:border-gray-600 text-pink-600 dark:text-pink-300'
                  }`}
                >
                  {cls === 'all' ? 'כולם' : cls}
                </button>
              ))}
            </div>
          )}

          {/* תיבת חוגגים בחודש - קבועה למעלה */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-pink-50 dark:border-gray-700 text-center transition-colors">
             <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">חוגגים בחודש</p>
             <p className="text-3xl font-black text-pink-600 dark:text-pink-400 mt-1">{currentMonthName}</p>
             <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-1 uppercase tracking-widest">
               {birthdayStudents.length} חוגגים{selectedClass !== 'all' ? ` ב${selectedClass}` : ''}
             </div>
          </div>
        </div>
      </div>

      {/* רשימת התלמידים הנגללת */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 no-scrollbar">
        {birthdayStudents.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
             <div className="mb-4 flex justify-center opacity-10"><CakeIcon className="w-16 h-16" /></div>
             <p className="text-lg">אין ימי הולדת{selectedClass !== 'all' ? ` בכיתה ${selectedClass}` : ''} בחודש זה</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {birthdayStudents.map((student) => {
               const dayMonth = (student.birthday_hebrew || "")
                 .split(' ')
                 .filter(part => !part.startsWith('תש'))
                 .join(' ');
               return (
                 <div key={student.id} onClick={() => navigate(`/student/${student.id}`)} className="student-card bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-pink-50 dark:border-gray-700 flex items-center active:scale-[0.98] transition-all cursor-pointer group">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={student.image_url} 
                        alt={student.full_name} 
                        className="rounded-full object-cover border-2 border-pink-100 dark:border-pink-900/30 shadow-sm transition-all duration-200" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(student.full_name)}`; }} 
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                       <div className="flex items-center gap-2">
                         <h3 className="font-bold text-gray-800 dark:text-white truncate transition-all duration-200">{student.full_name}</h3>
                         <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{student.class}</span>
                       </div>
                       <p className="birthday-tag text-pink-600 dark:text-pink-400 font-bold mt-0.5 transition-all duration-200">{dayMonth}</p>
                    </div>
                    <div className="text-pink-100 dark:text-gray-700"><ChevronLeftIcon className="w-5 h-5" /></div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayPage;
