import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { CakeIcon, ArrowRightIcon, ChevronLeftIcon } from './Icons';
import Avatar from './Avatar';
import { 
  getCurrentHebrewDateInfo, 
  isBirthdayMonthMatch, 
  hebrewDayToNumber 
} from '../utils/hebrewDate';

interface BirthdayPageProps {
  students: Student[];
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
}

export const BirthdayPage: React.FC<BirthdayPageProps> = ({ 
  students, 
  selectedClass, 
  setSelectedClass 
}) => {
  const navigate = useNavigate();
  const dateInfo = useMemo(() => getCurrentHebrewDateInfo(), []);

  const classes = useMemo(() => {
    const studentsWithBirthday = students.filter(student => 
      isBirthdayMonthMatch(student.birthday_hebrew, dateInfo.monthName)
    );
    const uniqueClasses = new Set(studentsWithBirthday.map(s => s.class).filter(Boolean));
    return ['all', ...Array.from(uniqueClasses).sort()];
  }, [students, dateInfo.monthName]);

  const birthdayStudents = useMemo(() => {
    return students
      .filter(student => {
        const matchesMonth = isBirthdayMonthMatch(student.birthday_hebrew, dateInfo.monthName);
        const matchesClass = selectedClass === 'all' || student.class === selectedClass;
        return matchesMonth && matchesClass;
      })
      .sort((a, b) => {
        const dayA = (a.birthday_hebrew || "").split(/\s+/)[0];
        const dayB = (b.birthday_hebrew || "").split(/\s+/)[0];
        return hebrewDayToNumber(dayA) - hebrewDayToNumber(dayB);
      });
  }, [students, dateInfo.monthName, selectedClass]);

  return (
    <div className="h-full bg-[#FAF8F5] dark:bg-stone-950 flex flex-col transition-colors duration-200 overflow-hidden">
      {/* אזור כותרת וסינון */}
      <div className="flex-shrink-0 bg-[#FAF8F5]/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 z-30">
        <div className="p-4 space-y-3">
          {/* שורת ניווט עליונה */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              aria-label="חזרה לאלפון"
            >
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <div className="text-right flex-1">
              <h1 className="text-xl font-heading font-bold text-stone-900 dark:text-stone-100 leading-tight">
                ימי הולדת
              </h1>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 tracking-wide">
                {dateInfo.fullFormatted}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <CakeIcon className="w-5 h-5" />
            </div>
          </div>

          {/* סינון מחזורים */}
          {classes.length > 2 && (
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
                    {cls === 'all' ? 'כל המחזורים' : cls}
                  </button>
                );
              })}
            </div>
          )}

          {/* כרטיס החודש העברי החגיגי */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/90 dark:border-stone-800 text-center shadow-sm">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">חוגגים בחודש העברי</p>
            <p className="text-3xl font-heading font-black text-amber-600 dark:text-amber-400 mt-0.5 tracking-tight">
              {dateInfo.monthName || 'החודש'}
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500 font-medium mt-1">
              {birthdayStudents.length} חוגגים{selectedClass !== 'all' ? ` ב${selectedClass}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* רשימת התלמידים החוגגים */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 pb-24 no-scrollbar">
        {birthdayStudents.length === 0 ? (
          <div className="text-center py-20 text-stone-400 dark:text-stone-500 bg-white/60 dark:bg-stone-900/60 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
            <div className="mb-3 flex justify-center opacity-25">
              <CakeIcon className="w-12 h-12 text-amber-500" />
            </div>
            <p className="text-base font-medium text-stone-700 dark:text-stone-300">
              אין ימי הולדת{selectedClass !== 'all' ? ` בכיתה ${selectedClass}` : ''} בחודש זה
            </p>
          </div>
        ) : (
          birthdayStudents.map((student) => {
            return (
              <div 
                key={student.id} 
                onClick={() => navigate(`/student/${student.id}`)} 
                className="bg-white dark:bg-stone-900 rounded-2xl p-3.5 border border-stone-200/80 dark:border-stone-800/90 shadow-sm hover:shadow flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar 
                    name={student.full_name} 
                    imageUrl={student.image_url} 
                    sizeClassName="w-12 h-12 text-sm"
                  />
                  <div className="min-w-0 text-right">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-stone-900 dark:text-stone-100 truncate text-[15px]">
                        {student.full_name}
                      </h3>
                      {student.class && (
                        <span className="text-xs text-stone-400 dark:text-stone-500 font-normal">
                          {student.class}
                        </span>
                      )}
                    </div>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold text-xs mt-0.5">
                      {student.birthday_hebrew}
                    </p>
                  </div>
                </div>

                <div className="text-stone-300 dark:text-stone-600 group-hover:-translate-x-1 transition-transform mr-2">
                  <ChevronLeftIcon className="w-4 h-4" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BirthdayPage;
