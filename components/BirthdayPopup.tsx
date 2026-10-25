import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { XIcon, WhatsappIcon, CakeIcon } from './Icons';
import Avatar from './Avatar';

interface BirthdayPopupProps {
  students: Student[];
}

export const BirthdayPopup: React.FC<BirthdayPopupProps> = ({ students }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const isMulti = students.length > 1;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200);
    const autoHideTime = isMulti ? 10000 : 7000;
    const closeTimer = setTimeout(() => setIsVisible(false), autoHideTime);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [isMulti]);

  const handleWhatsApp = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    let cleanNum = student.phone_number.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '972' + cleanNum.substring(1);
    }
    const message = encodeURIComponent(`מזל טוב ליום הולדתך! שפע ברכה והצלחה 🎂`);
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
  };

  const handleStudentClick = (studentId: string) => {
    setIsVisible(false);
    navigate(`/student/${studentId}`);
  };

  if (!isVisible || students.length === 0) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 z-[90] max-w-md mx-auto transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none'}`}>
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200/80 dark:border-amber-800/60 p-4 relative">
        {/* כפתור סגירה */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 left-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5 rounded-lg transition-colors"
          aria-label="סגור הודעה"
        >
          <XIcon className="w-4 h-4" />
        </button>

        {isMulti ? (
          /* תצוגת קבוצה */
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-500"><CakeIcon className="w-5 h-5" /></span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                חגיגת יום הולדת במכינה
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              היום חוגגים יום הולדת ל-{students.length} תלמידים:
            </p>
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-0.5 no-scrollbar">
              {students.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => handleStudentClick(student.id)}
                  className="flex items-center justify-between bg-stone-50 dark:bg-stone-800/60 p-2 rounded-xl border border-stone-200/60 dark:border-stone-700/60 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar 
                      name={student.full_name} 
                      imageUrl={student.image_url} 
                      sizeClassName="w-9 h-9 text-xs" 
                    />
                    <div className="min-w-0 text-right">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{student.full_name}</p>
                      <p className="text-[10px] text-stone-400">{student.class}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleWhatsApp(student, e)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                    title="שלח איחול"
                  >
                    <WhatsappIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* תצוגת יחיד */
          <div 
            className="flex items-center gap-3.5 text-right cursor-pointer"
            onClick={() => handleStudentClick(students[0].id)}
          >
            <div className="relative shrink-0">
              <Avatar 
                name={students[0].full_name} 
                imageUrl={students[0].image_url} 
                sizeClassName="w-12 h-12 text-sm" 
              />
              <div className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 p-0.5 rounded-full border-2 border-white dark:border-stone-900 shadow">
                <CakeIcon className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400">
                יום הולדת היום!
              </span>
              <h4 className="font-heading text-stone-900 dark:text-stone-100 font-bold leading-tight text-sm truncate">
                {students[0].full_name} {students[0].class ? `· ${students[0].class}` : ''}
              </h4>
              <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5">רוצה לאחל לו מזל טוב?</p>
            </div>

            <button 
              onClick={(e) => handleWhatsApp(students[0], e)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 active:scale-95 transition-all shadow-sm"
              title="שלח ברכה בוואטסאפ"
            >
              <WhatsappIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayPopup;
