
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  XIcon, WrenchIcon, CalendarIcon, MailIcon, ChevronLeftIcon, 
  HeartIcon, MoonIcon, SunIcon, CreditCardIcon, BankIcon, 
  CakeIcon, FontSizeIcon 
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
  const [showDonation, setShowDonation] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    if (isOpen || showSchedule || showDonation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, showSchedule, showDonation]);

  const menuItems = [
    {
      label: 'ימי הולדת החודש',
      url: '#',
      icon: <CakeIcon className="w-5 h-5 text-pink-500" />,
      color: 'bg-pink-50 dark:bg-pink-900/30',
      isExternal: false,
      onClick: (e: React.MouseEvent) => { e.preventDefault(); onClose(); navigate('/birthdays'); }
    },
    {
      label: 'טופס תיקונים',
      url: 'https://www.ybe.org.il/%D7%9E%D7%9B%D7%99%D7%A0%D7%AA-%D7%91%D7%99%D7%AA-%D7%90%D7%9C',
      icon: <WrenchIcon className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/30',
      isExternal: true
    },
    {
      label: 'לו"ז שבועי',
      url: '#',
      icon: <CalendarIcon className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/30',
      isExternal: false,
      onClick: (e: React.MouseEvent) => { e.preventDefault(); onClose(); setShowSchedule(true); }
    },
    {
      label: 'תרומה למכינה',
      url: '#',
      icon: <HeartIcon className="w-5 h-5 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/30',
      isExternal: false,
      onClick: (e: React.MouseEvent) => { e.preventDefault(); onClose(); setShowDonation(true); }
    },
    {
      label: 'צור קשר',
      url: 'https://did.li/Contact-us1',
      icon: <MailIcon className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50 dark:bg-green-900/30',
      isExternal: true
    }
  ];

  return (
    <>
      {showDonation && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowDonation(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDonation(false)} className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><XIcon className="w-6 h-6" /></button>
            <div className="text-center mb-6 mt-2">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600 dark:text-red-400"><HeartIcon className="w-8 h-8 fill-current" /></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">דרכי תרומה למכינה</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-300"><CreditCardIcon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-gray-800 dark:text-white">באשראי ובביט</h3>
                </div>
                <a href="https://bit.ly/תרומה-לישיבת-בית-אל" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-lg font-medium transition-colors">מעבר לתשלום מאובטח</a>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg text-purple-600 dark:text-purple-300"><BankIcon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-gray-800 dark:text-white">בהעברה בנקאית</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 pr-2">
                  <p><span className="font-semibold text-gray-800 dark:text-white">שם החשבון:</span> קרית הישיבה בית אל</p>
                  <p><span className="font-semibold text-gray-800 dark:text-white">בנק:</span> יובנק (26)</p>
                  <p><span className="font-semibold text-gray-800 dark:text-white">סניף:</span> 288</p>
                  <p><span className="font-semibold text-gray-800 dark:text-white">מספר חשבון:</span> 320196</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSchedule && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center animate-fadeIn" onClick={() => setShowSchedule(false)}>
          <button onClick={() => setShowSchedule(false)} className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-20"><XIcon className="w-6 h-6" /></button>
          <div className="w-full h-full overflow-auto flex items-center justify-center p-2">
            <img src="https://i.postimg.cc/VL8VvCWj/lwz.jpg" alt="לוח זמנים שבועי" className="rounded-lg shadow-2xl max-w-full max-h-[90vh] object-contain" />
          </div>
        </div>
      )}

      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden="true" />

      <div className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* כותרת התפריט */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{APP_CONFIG.NAME}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><XIcon className="w-5 h-5" /></button>
        </div>
        
        {/* תוכן התפריט - ניווט */}
        <div className="flex-1 overflow-y-auto p-4 py-4 no-scrollbar">
          <nav className="space-y-1 mb-6">
            {menuItems.map((item, index) => (
              <a key={index} href={item.url} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined} onClick={item.onClick || onClose} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all group cursor-pointer">
                <div className={`p-1.5 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <div className="flex-1"><span className="font-bold text-gray-700 dark:text-gray-200 block text-[15px]">{item.label}</span></div>
                <ChevronLeftIcon className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              </a>
            ))}
          </nav>
        </div>

        {/* הגדרות תצוגה - צמוד לתחתית */}
        <div className="p-4 pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-2.5 border border-gray-100 dark:border-gray-700 space-y-3 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">הגדרות תצוגה</h3>
            
            {/* מתג לילה/יום */}
            <button onClick={toggleTheme} className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                  {isDark ? <MoonIcon className="w-3.5 h-3.5" /> : <SunIcon className="w-3.5 h-3.5" />}
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200 text-[11px]">{isDark ? 'מצב כהה' : 'מצב בהיר'}</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${isDark ? '-translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* סליידר גודל גופן/כרטיס */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 px-1">
                <div className="flex items-center gap-1.5">
                  <FontSizeIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">גודל כרטיסים</span>
                </div>
              </div>
              <div className="px-2 pb-1">
                <div className="flex items-center justify-between mb-1 px-0.5">
                  <span className="text-[10px] text-gray-400">א</span>
                  <span className="text-[14px] text-gray-400">א</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1" 
                  value={cardScaleLevel} 
                  onChange={(e) => onScaleChange(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center text-[9px] text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase">גרסה 1.0.2</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
