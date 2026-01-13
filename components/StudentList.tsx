
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { SearchIcon, XIcon, ArrowRightIcon, MenuIcon, CakeIcon } from './Icons';
import { APP_CONFIG } from '../constants';
import Sidebar from './Sidebar';

// כלי עזר להמרת מספר (יום או שנה) למחרוזת גימטריה עברית
const getHebrewGematria = (num: number): string => {
  if (num <= 0) return "";
  
  // בחישוב שנים עבריות נהוג להשתמש ב"פרט קטן" (ללא האלפים)
  const n = num > 5000 ? num - 5000 : num;
  
  const units = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת"];
  
  let result = "";
  let tempNum = n;

  // חישוב מאות
  while (tempNum >= 400) {
    result += "ת";
    tempNum -= 400;
  }
  if (tempNum >= 100) {
    const h = Math.floor(tempNum / 100);
    result += hundreds[h];
    tempNum %= 100;
  }

  // טיפול במקרים מיוחדים של ט"ו ו-ט"ז
  if (tempNum === 15) {
    result += "טו";
  } else if (tempNum === 16) {
    result += "טז";
  } else {
    // חישוב עשרות
    if (tempNum >= 10) {
      result += tens[Math.floor(tempNum / 10)];
      tempNum %= 10;
    }
    // חישוב יחידות
    if (tempNum > 0) {
      result += units[tempNum];
    }
  }

  // הוספת גרשיים או גרש לפי כללי הדקדוק
  if (result.length > 1) {
    return result.slice(0, -1) + '״' + result.slice(-1);
  }
  return result + '׳';
};

interface StudentListProps {
  students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // עיצוב תאריך עברי יציב לכותרת
  const currentHebrewDate = useMemo(() => {
    const now = new Date();
    // שימוש ב-Intl רק כדי לחלץ את חלקי התאריך
    const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(now);
    
    const dayVal = parseInt(parts.find(p => p.type === 'day')?.value || "0");
    const monthVal = parts.find(p => p.type === 'month')?.value || "";
    const yearVal = parseInt(parts.find(p => p.type === 'year')?.value || "0");

    const cleanMonth = monthVal.startsWith('ב') ? monthVal.substring(1) : monthVal;
    const gematriaDay = getHebrewGematria(dayVal);
    const gematriaYear = getHebrewGematria(yearVal);

    return `${gematriaDay} ${cleanMonth} ${gematriaYear}`;
  }, []);

  // קבלת שם החודש העברי הנוכחי לצורך סינון ימי הולדת
  const currentHebrewMonth = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' });
    const monthPart = formatter.format(new Date());
    return monthPart.startsWith('ב') ? monthPart.substring(1) : monthPart;
  }, []);

  const classes = useMemo(() => {
    const uniqueClasses = new Set(students.map(s => s.class).filter(Boolean));
    return ['all', ...Array.from(uniqueClasses).sort()];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone_number.includes(searchQuery);
      
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClass]);

  return (
    <div className="flex flex-col h-full relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 p-4 space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-center relative min-h-[44px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">{APP_CONFIG.NAME}</h1>
            <p className="text-[14px] text-blue-600 dark:text-blue-400 font-bold mt-0.5 tracking-wide">{currentHebrewDate}</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-0 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="פתח תפריט"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="חיפוש לפי שם או טלפון..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 text-right"
          />
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <SearchIcon className="w-5 h-5" />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <button
            onClick={() => setSelectedClass('all')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedClass === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
            }`}
          >
            כולם
          </button>
          {classes.filter(c => c !== 'all').map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedClass === cls 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <p className="text-lg">לא נמצאו תוצאות</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">נסה לחפש שם אחר או לשנות את הסינון</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            // בדיקה האם יום ההולדת חל בחודש הנוכחי
            const isBirthday = student.birthday_hebrew && student.birthday_hebrew.includes(currentHebrewMonth);
            
            return (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
              >
                <div className="relative">
                  <img 
                    src={student.image_url} 
                    alt={student.full_name} 
                    className="w-14 h-14 rounded-full object-cover border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(student.full_name)}`;
                    }}
                  />
                  {isBirthday && (
                    <div className="absolute -top-1 -right-1 bg-pink-500 text-white p-1 rounded-full shadow-lg border-2 border-white dark:border-gray-800 animate-bounce z-10">
                      <CakeIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate leading-tight">
                      {student.full_name}
                    </h3>
                    {isBirthday && <span className="text-pink-500 text-[10px] font-bold animate-pulse px-1.5 py-0.5 bg-pink-50 dark:bg-pink-900/20 rounded-full">מזל טוב!</span>}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate dir-ltr">
                    {student.phone_number}
                  </p>
                </div>
                <div className="text-gray-300 dark:text-gray-600">
                  <ArrowRightIcon className="w-5 h-5 transform rotate-180 text-blue-500/50" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentList;
