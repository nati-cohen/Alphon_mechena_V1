import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { fetchStudents, getCachedStudents } from './services/dataService';
import { Student } from './types';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import BirthdayPage from './components/BirthdayPage';
import DonationPage from './components/DonationPage';
import InstallPwa from './components/InstallPwa';
import BirthdayPopup from './components/BirthdayPopup';
import { 
  getCurrentHebrewDateInfo, 
  normalizeHebrew, 
  isBirthdayMonthMatch 
} from './utils/hebrewDate';
import { initTheme } from './utils/theme';

const App: React.FC = () => {
  // Stale-While-Revalidate: טעינה מיידית ב-0 שניות מהמטמון
  const cached = getCachedStudents();
  const [students, setStudents] = useState<Student[]>(() => cached || []);
  const [loading, setLoading] = useState<boolean>(() => !cached || cached.length === 0);
  const [birthdayTodayStudents, setBirthdayTodayStudents] = useState<Student[]>([]);

  const [mainListClass, setMainListClass] = useState('all');
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [birthdayListClass, setBirthdayListClass] = useState('all');
  
  const [cardScaleLevel, setCardScaleLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('app-card-scale-level');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const findTodayBirthdays = (studentsData: Student[]) => {
    try {
      const { dayGematria, monthName } = getCurrentHebrewDateInfo();
      const cleanDay = normalizeHebrew(dayGematria);
      const cleanMonth = normalizeHebrew(monthName);

      const matches = studentsData.filter(s => {
        if (!s.birthday_hebrew) return false;
        const bDayRaw = s.birthday_hebrew.trim();
        const bDayParts = bDayRaw.split(/\s+/);
        if (bDayParts.length < 2) return false;
        const studentDay = normalizeHebrew(bDayParts[0]);
        const isSameDay = studentDay === cleanDay;
        const matchesMonth = isBirthdayMonthMatch(bDayRaw, cleanMonth);
        return isSameDay && matchesMonth;
      });

      if (matches.length > 0) {
        setBirthdayTodayStudents(matches);
      }
    } catch (e) {
      console.error("Error in findTodayBirthdays:", e);
    }
  };

  useEffect(() => {
    // אתחול ערכת נושא וסנכרון סרגלי מערכת (Status Bar ו-Navigation Bar)
    initTheme();

    // בדיקת ימי הולדת על בסיס הנתונים שכבר במטמון
    if (cached && cached.length > 0) {
      findTodayBirthdays(cached);
    }

    // סנכרון שקט מול ה-Google Sheet CSV
    const loadData = async () => {
      try {
        const freshData = await fetchStudents();
        setStudents(freshData);
        findTodayBirthdays(freshData);
      } catch (err) {
        console.warn("Could not fetch fresh data, using cached:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // סנכרון גודל כרטיסים ל-CSS Variable
  useEffect(() => {
    try {
      const root = document.documentElement;
      const scaleMap: Record<number, number> = {
        1: 0.75, 2: 0.88, 3: 1.0, 4: 1.15, 5: 1.35
      };
      const scaleValue = scaleMap[cardScaleLevel] || 1.0;
      root.style.setProperty('--card-scale', scaleValue.toString());
      localStorage.setItem('app-card-scale-level', cardScaleLevel.toString());
    } catch (e) {
      console.warn("Could not save cardScaleLevel:", e);
    }
  }, [cardScaleLevel]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await fetchStudents();
      setStudents(freshData);
      findTodayBirthdays(freshData);
    } catch (err) {
      console.warn("Could not refresh data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAF8F5] dark:bg-stone-950 flex-col gap-3">
        <div className="w-9 h-9 border-2 border-stone-300 dark:border-stone-700 border-t-amber-600 rounded-full animate-spin" />
        <p className="text-xs font-medium text-stone-500 dark:text-stone-400">טוען אלפון תלמידים...</p>
      </div>
    );
  }

  return (
    <HashRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="max-w-md mx-auto bg-[#FAF8F5] dark:bg-stone-950 h-[100dvh] min-h-screen shadow-2xl overflow-hidden relative transition-colors duration-200">
        {birthdayTodayStudents.length > 0 && (
          <BirthdayPopup students={birthdayTodayStudents} />
        )}
        
        <Routes>
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
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
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

          <Route path="/donate" element={<DonationPage />} />
          <Route path="/donations" element={<DonationPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <InstallPwa />
      </div>
    </HashRouter>
  );
};

export default App;
