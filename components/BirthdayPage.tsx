
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { CakeIcon, ArrowRightIcon, ChevronLeftIcon } from './Icons';

// Helper to convert day number to Hebrew Gematria letters
const getHebrewDayGematria = (day: number): string => {
  const units = ["", "א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב", "י״ג", "י״ד", "ט״ו", "ט״ז", "י״ז", "י״ח", "י״ט", "כ׳", "כ״א", "כ״ב", "כ״ג", "כ״ד", "כ״ה", "כ״ו", "כ״ז", "כ״ח", "כ״ט", "ל׳"];
  return units[day] || day.toString();
};

const getHebrewYearGematria = (year: number): string => {
  const years: Record<number, string> = {
    5784: "תשפ״ד",
    5785: "תשפ״ה",
    5786: "תשפ״ו",
    5787: "תשפ״ז"
  };
  return years[year] || year.toString();
};

interface BirthdayPageProps {
  students: Student[];
}

const BirthdayPage: React.FC<BirthdayPageProps> = ({ students }) => {
  const navigate = useNavigate();

  // Robust Hebrew date formatting
  const currentHebrewDate = useMemo(() => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(now);
    
    const dayVal = parseInt(parts.find(p => p.type === 'day')?.value || "0");
    const monthVal = parts.find(p => p.type === 'month')?.value || "";
    const yearVal = parseInt(parts.find(p => p.type === 'year')?.value || "0");

    const cleanMonth = monthVal.startsWith('ב') ? monthVal.substring(1) : monthVal;
    const gematriaDay = getHebrewDayGematria(dayVal);
    const gematriaYear = getHebrewYearGematria(yearVal);

    return `${gematriaDay} ${cleanMonth} ${gematriaYear}`;
  }, []);

  // Get current Hebrew Month name (clean)
  const currentMonthName = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' });
    const monthPart = formatter.format(new Date());
    return monthPart.startsWith('ב') ? monthPart.substring(1) : monthPart;
  }, []);

  // Filter students who have a birthday in the current month
  const birthdayStudents = useMemo(() => {
    return students.filter(student => {
      if (!student.birthday_hebrew) return false;
      return student.birthday_hebrew.includes(currentMonthName);
    }).sort((a, b) => {
        return a.birthday_hebrew!.localeCompare(b.birthday_hebrew!);
    });
  }, [students, currentMonthName]);

  return (
    <div className="min-h-screen bg-pink-50/20 dark:bg-gray-900 flex flex-col animate-fadeIn transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-pink-100 dark:border-gray-700 sticky top-0 z-10 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <ArrowRightIcon className="w-6 h-6" />
        </button>
        <div className="text-right">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">ימי הולדת החודש</h1>
          <p className="text-[13px] text-pink-600 dark:text-pink-400 font-bold tracking-wide">{currentHebrewDate}</p>
        </div>
        <div className="mr-auto text-pink-500">
          <CakeIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-pink-50 dark:border-gray-700 text-center mb-4">
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">חוגגים בחודש</p>
           <p className="text-4xl font-black text-pink-600 dark:text-pink-400 mt-2">{currentMonthName}</p>
        </div>

        {birthdayStudents.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
             <div className="mb-4 flex justify-center opacity-10"><CakeIcon className="w-16 h-16" /></div>
             <p className="text-lg">אין ימי הולדת בחודש זה</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {birthdayStudents.map((student) => {
               const parts = student.birthday_hebrew!.split(' ');
               const dayMonth = parts.length >= 2 ? `${parts[0]} ${parts[1]}${parts[2] && isNaN(parseInt(parts[2])) ? ' ' + parts[2] : ''}` : student.birthday_hebrew;

               return (
                 <div 
                   key={student.id}
                   onClick={() => navigate(`/student/${student.id}`)}
                   className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-pink-50 dark:border-gray-700 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
                 >
                    <div className="w-14 h-14 rounded-full border-2 border-pink-100 dark:border-pink-900/30 overflow-hidden flex-shrink-0 shadow-sm">
                      <img 
                        src={student.image_url} 
                        alt={student.full_name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(student.full_name)}`;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-right">
                       <div className="flex items-center gap-2">
                         <h3 className="font-bold text-gray-800 dark:text-white text-lg truncate">{student.full_name}</h3>
                         <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {student.class}
                         </span>
                       </div>
                       <p className="text-pink-600 dark:text-pink-400 font-bold text-sm mt-0.5">{dayMonth}</p>
                    </div>

                    <div className="text-pink-100 dark:text-gray-700">
                       <ChevronLeftIcon className="w-5 h-5" />
                    </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>

      <div className="p-8 text-center text-gray-400 dark:text-gray-600 text-xs italic">
         "יום הולדת הוא היום בו אלוקים החליט שהעולם אינו יכול להתקיים בלעדיך..."
      </div>
    </div>
  );
};

export default BirthdayPage;
