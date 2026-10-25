import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  XIcon, WrenchIcon, CalendarIcon, MailIcon, ChevronLeftIcon, 
  HeartIcon, MoonIcon, SunIcon, CakeIcon, FontSizeIcon 
} from './Icons';
import { APP_CONFIG } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cardScaleLevel: number;
  onScaleChange: (level: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, cardScaleLevel, onScaleChange }) => {
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    try {
      if (isDark) {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDark(false);
      } else {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDark(true);
      }
    } catch (e) {
      console.warn("Could not save theme to localStorage:", e);
    }
  };

  useEffect(() => {
    if (isOpen || showSchedule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, showSchedule]);

  const menuItems = [
    {
      label: 'ימי הולדת החודש',
      url: '#',
      icon: <CakeIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      isExternal: false,
      onClick: (e: React.MouseEvent) => { 
        e.preventDefault(); 
        onClose(); 
        navigate('/birthdays'); 
      }
    },
    {
      label: 'טופס תיקונים ',
      url: 'https://www.ybe.org.il/%D7%9E%D7%9B%D7%99%D7%A0%D7%AA-%D7%91%D7%99%D7%AA-%D7%90%D7%9C',
      icon: <WrenchIcon className="w-4 h-4 text-stone-600 dark:text-stone-300" />,
      isExternal: true
    },
    {
      label: 'לו"ז שבועי',
      url: '#',
      icon: <CalendarIcon className="w-4 h-4 text-stone-600 dark:text-stone-300" />,
      isExternal: false,
      onClick: (e: React.MouseEvent) => { 
        e.preventDefault(); 
        onClose(); 
        setShowSchedule(true); 
      }
    },
    {
      label: 'תרומה למכינה',
      url: '#',
      icon: <HeartIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      isExternal: false,
      onClick: (e: React.MouseEvent) => { 
        e.preventDefault(); 
        onClose(); 
        navigate('/donate'); 
      }
    },
    {
      label: 'צור קשר  ',
      url: 'https://did.li/Contact-us1',
      icon: <MailIcon className="w-4 h-4 text-stone-600 dark:text-stone-300" />,
      isExternal: true
    }
  ];

  return (
    <>
      {/* לוח זמנים שבועי */}
      {showSchedule && (
        <div 
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn" 
          onClick={() => setShowSchedule(false)}
        >
          <button 
            onClick={() => setShowSchedule(false)} 
            className="absolute top-5 left-5 bg-stone-800 text-stone-200 hover:text-white p-2.5 rounded-full transition-colors z-20"
            aria-label="סגירה"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-auto flex items-center justify-center p-2">
            <img 
              src="https://i.postimg.cc/SsXX03fC/m'rkt-s'wt-tspz.jpg" 
              alt="לוח זמנים שבועי" 
              className="rounded-2xl shadow-2xl max-w-full max-h-[85vh] object-contain border border-stone-800" 
            />
          </div>
        </div>
      )}

      {/* רקע מעומעם לתפריט הצד */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* תפריט צד */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[#FAF8F5] dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* כותרת התפריט */}
        <div className="p-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-stone-900 dark:text-stone-100">{APP_CONFIG.NAME}</h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">תפריט אפשרויות</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
            aria-label="סגור תפריט"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        
        {/* פריטי ניווט ראשיים (ללא עיגולי פסטל צעקניים) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <a 
                key={index} 
                href={item.url} 
                target={item.isExternal ? "_blank" : undefined} 
                rel={item.isExternal ? "noopener noreferrer" : undefined} 
                onClick={item.onClick || onClose} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-800/80 border border-transparent hover:border-stone-200/80 dark:hover:border-stone-700/60 transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 shrink-0">
                  {item.icon}
                </div>
                <span className="flex-1 font-medium text-sm text-stone-800 dark:text-stone-200">
                  {item.label}
                </span>
                <ChevronLeftIcon className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 group-hover:-translate-x-0.5 transition-transform" />
              </a>
            ))}
          </nav>
        </div>

        {/* הגדרות תצוגה בתחתית */}
        <div className="p-4 border-t border-stone-200/80 dark:border-stone-800 space-y-3 bg-stone-100/50 dark:bg-stone-950/40">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
              העדפות תצוגה
            </h3>
            
            {/* מתג מצב כהה / בהיר */}
            <button 
              onClick={toggleTheme} 
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 hover:border-stone-300 dark:hover:border-stone-600 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-amber-400">
                  {isDark ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
                </div>
                <span className="font-medium text-xs text-stone-800 dark:text-stone-200">
                  {isDark ? 'מצב לילה פעיל' : 'מצב יום פעיל'}
                </span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${isDark ? 'bg-amber-600' : 'bg-stone-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${isDark ? '-translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* סליידר גודל כרטיס */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1.5">
                  <FontSizeIcon className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-xs font-medium">קנה מידה לכרטיסים</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">{cardScaleLevel} / 5</span>
              </div>
              <div className="px-1 pt-1">
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1" 
                  value={cardScaleLevel} 
                  onChange={(e) => onScaleChange(parseInt(e.target.value, 10))}
                  aria-label="קנה מידה לכרטיסים"
                  className="w-full accent-amber-600 dark:accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-0.5 font-mono">
                  <span>קטן</span>
                  <span>רגיל</span>
                  <span>גדול</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-stone-400 dark:text-stone-500 font-mono">
            מכינת בית אל · תשפ״ו
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
