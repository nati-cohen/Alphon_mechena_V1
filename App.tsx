
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { fetchStudents } from './services/dataService';
import { Student } from './types';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import BirthdayPage from './components/BirthdayPage';
import InstallPwa from './components/InstallPwa';
import BirthdayPopup from './components/BirthdayPopup';

const normalizeHebrew = (text: string): string => {
  return text.replace(/['"״׳]/g, '').trim();
};

const getHebrewGematria = (num: number): string => {
  if (num <= 0) return "";
  const n = num > 5000 ? num - 5000 : num;
  const units = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת"];
  let result = "";
  let tempNum = n;
  while (tempNum >= 400) { result += "ת"; tempNum -= 400; }
  if (tempNum >= 100) { result += hundreds[Math.floor(tempNum / 100)]; tempNum %= 100; }
  if (tempNum === 15) { result += "טו"; } else if (tempNum === 16) { result += "טז"; } else {
    if (tempNum >= 10) { result += tens[Math.floor(tempNum / 10)]; tempNum %= 10; }
    if (tempNum > 0) result += units[tempNum];
  }
  return result;
};

const isBirthdayMatchLocal = (studentBirthday: string | undefined, currentMonth: string): boolean => {
  if (!studentBirthday) return false;
  const bDay = studentBirthday.replace(/['"״׳]/g, '').trim();
  const curr = currentMonth.replace(/['"״׳]/g, '').trim();
  const isStudentAdarA = bDay.includes("אדר א");
  const isStudentAdarB = bDay.includes("אדר ב");
  const isStudentAdarPlain = bDay.includes("אדר") && !isStudentAdarA && !isStudentAdarB;
  if (curr === "אדר") return isStudentAdarPlain || isStudentAdarA || isStudentAdarB;
  if (curr === "אדר א") return isStudentAdarA;
  if (curr === "אדר ב") return isStudentAdarB || isStudentAdarPlain;
  return bDay.includes(curr);
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [birthdayTodayStudents, setBirthdayTodayStudents] = useState<Student[]>([]);

  const [mainListClass, setMainListClass] = useState('all');
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [birthdayListClass, setBirthdayListClass] = useState('all');
  
  const [cardScaleLevel, setCardScaleLevel] = useState<number>(() => {
    const saved = localStorage.getItem('app-card-scale-level');
    return saved ? parseInt(saved, 10) : 3;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
        findTodayBirthdays(data);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const scaleMap: Record<number, number> = {
      1: 0.7, 2: 0.85, 3: 1.0, 4: 1.2, 5: 1.45
    };
    const scaleValue = scaleMap[cardScaleLevel] || 1.0;
    root.style.setProperty('--card-scale', scaleValue.toString());
    localStorage.setItem('app-card-scale-level', cardScaleLevel.toString());
  }, [cardScaleLevel]);

  const findTodayBirthdays = (studentsData: Student[]) => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', { day: 'numeric', month: 'long' }).formatToParts(now);
      const dayNum = parseInt(parts.find(p => p.type === 'day')?.value || "0");
      const monthName = parts.find(p => p.type === 'month')?.value || "";

      const todayDayGematria = normalizeHebrew(getHebrewGematria(dayNum));
      const todayMonthClean = normalizeHebrew(monthName.startsWith('ב') ? monthName.substring(1) : monthName);

      const matches = studentsData.filter(s => {
        if (!s.birthday_hebrew) return false;
        const bDayRaw = s.birthday_hebrew.trim();
        const bDayParts = bDayRaw.split(/\s+/);
        if (bDayParts.length < 2) return false;
        const studentDay = normalizeHebrew(bDayParts[0]);
        const isSameDay = studentDay === todayDayGematria;
        const matchesMonth = isBirthdayMatchLocal(bDayRaw, todayMonthClean);
        return isSameDay && matchesMonth;
      });

      if (matches.length > 0) {
        setBirthdayTodayStudents(matches);
      }
    } catch (e) {
      console.error("Error in findTodayBirthdays:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium font-sans">טוען נתונים...</p>
      </div>
    );
  }

  return (
    <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 h-screen shadow-2xl overflow-hidden relative transition-colors duration-200">
        {birthdayTodayStudents.length > 0 && <BirthdayPopup students={birthdayTodayStudents} />}
        
        <Routes>
          {/* דף הבית - אלפון התלמידים. מופיע ראשון כדי שיהיה דף ברירת המחדל */}
          <Route 
            path="/" 
            element={
              <StudentList 
                students={students} 
                selectedClass={mainListClass} 
                setSelectedClass={setMainListClass}
                searchQuery={mainSearchQuery}
                setSearchQuery={setMainSearchQuery}
                cardScaleLevel={cardScaleLevel}
                onScaleChange={setCardScaleLevel}
              />
            } 
          />
          
          <Route path="/student/:id" element={<StudentDetail students={students} />} />
          
          <Route 
            path="/birthdays" 
            element={
              <BirthdayPage 
                students={students} 
                selectedClass={birthdayListClass}
                setSelectedClass={setBirthdayListClass}
              />
            } 
          />

          {/* בכל ניתוב אחר, חזור לדף הבית */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <InstallPwa />
      </div>
    </HashRouter>
  );
};

export default App;
