import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { fetchStudents } from './services/dataService';
import { Student } from './types';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import InstallPwa from './components/InstallPwa';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Dark Mode
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
      } catch (err) {
        console.error(err);
        setError('שגיאה בטעינת הנתונים. אנא בדוק את החיבור לאינטרנט או נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">טוען נתונים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-sm">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">שגיאה בטעינה</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen shadow-2xl overflow-hidden relative transition-colors duration-200">
        <Routes>
          <Route path="/" element={<StudentList students={students} />} />
          <Route path="/student/:id" element={<StudentDetail students={students} />} />
        </Routes>
        <InstallPwa />
      </div>
    </HashRouter>
  );
};

export default App;