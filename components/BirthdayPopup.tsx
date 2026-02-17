
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { XIcon, WhatsappIcon, CakeIcon } from './Icons';

interface BirthdayPopupProps {
  students: Student[];
}

const BirthdayPopup: React.FC<BirthdayPopupProps> = ({ students }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const isMulti = students.length > 1;

  useEffect(() => {
    // אנימציית כניסה קלה
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // סגירה אוטומטית: 6 שניות ליחיד, 10 שניות לקבוצה (בתוספת זמן האנימציה)
    const autoHideTime = isMulti ? 11000 : 7000;
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
    const message = encodeURIComponent(`מזל טוב ליום הולדתך! 🎂🎈`);
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank');
  };

  const handleStudentClick = (studentId: string) => {
    setIsVisible(false);
    navigate(`/student/${studentId}`);
  };

  if (!isVisible || students.length === 0) return null;

  return (
    <div className={`fixed top-6 left-4 right-4 z-[200] transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-pink-100 dark:border-pink-900/50 p-4 relative overflow-visible">
        
        {/* כפתור סגירה מובלט */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -left-3 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 hover:text-gray-800 dark:hover:text-white transition-all active:scale-90 z-20"
        >
          <XIcon className="w-4 h-4" />
        </button>

        {isMulti ? (
          /* --- תצוגה לקבוצה (Integrated View) --- */
          <div className="text-right">
             {/* קישוט רקע לרשימה */}
            <div className="absolute -right-2 -top-2 opacity-10 text-pink-500 -rotate-12 pointer-events-none">
              <CakeIcon className="w-16 h-16" />
            </div>

            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">חגיגה במכינה! 🎉</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">היום חוגגים יום הולדת ל-{students.length} תלמידים:</p>
            
            <div className="max-h-56 overflow-y-auto pr-1 space-y-3 no-scrollbar">
              {students.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => handleStudentClick(student.id)}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-600 active:scale-95 transition-all cursor-pointer group"
                >
                  <img 
                    src={student.image_url} 
                    alt={student.full_name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-500 shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(student.full_name)}`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{student.full_name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{student.class}</p>
                  </div>
                  <button 
                    onClick={(e) => handleWhatsApp(student, e)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl shadow-sm active:scale-90 transition-all"
                  >
                    <WhatsappIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- תצוגה ליחיד (Original View) --- */
          <div 
            className="flex items-center gap-4 text-right cursor-pointer"
            onClick={() => handleStudentClick(students[0].id)}
          >
            {/* קישוט רקע ליחיד */}
            <div className="absolute -right-4 -bottom-4 opacity-5 text-pink-500 rotate-12 pointer-events-none">
              <CakeIcon className="w-24 h-24" />
            </div>

            {/* תמונת תלמיד */}
            <div className="relative flex-shrink-0">
              <img 
                src={students[0].image_url} 
                alt={students[0].full_name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-pink-100 shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(students[0].full_name)}`; }}
              />
              <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white p-1 rounded-full text-[10px] animate-bounce shadow-md">🎂</div>
            </div>

            {/* תוכן הודעה */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-black uppercase tracking-wider mb-0.5">יש לנו חגיגה!</p>
              <h4 className="text-gray-900 dark:text-white font-bold leading-tight text-base">
                היום יום הולדת ל<span className="text-pink-600 dark:text-pink-400">{students[0].full_name}</span> - {students[0].class}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">רוצה לאחל לו מזל טוב?</p>
            </div>

            {/* כפתור וואטסאפ בודד */}
            <div className="flex-shrink-0">
              <button 
                onClick={(e) => handleWhatsApp(students[0], e)}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-2xl shadow-lg shadow-green-500/20 active:scale-90 transition-all"
              >
                <WhatsappIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayPopup;
