
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { XIcon, WrenchIcon, CalendarIcon, MailIcon, ChevronLeftIcon, HeartIcon, MoonIcon, SunIcon, CreditCardIcon, BankIcon, CashIcon, CakeIcon } from './Icons';
import { APP_CONFIG } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [zoom, setZoom] = useState(1);
  const pinchRef = useRef({ startDist: 0, startZoom: 1 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
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
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showSchedule, showDonation]);

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setShowSchedule(true);
  };

  const handleDonationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setShowDonation(true);
  };

  const handleBirthdaysClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    navigate('/birthdays');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current.startDist = dist;
      pinchRef.current.startZoom = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current.startDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newZoom = pinchRef.current.startZoom * (dist / pinchRef.current.startDist);
      setZoom(Math.min(Math.max(1, newZoom), 5));
    }
  };

  const menuItems = [
    {
      label: 'ימי הולדת החודש',
      url: '#',
      icon: <CakeIcon className="w-5 h-5 text-pink-500" />,
      color: 'bg-pink-50 dark:bg-pink-900/30',
      isExternal: false,
      onClick: handleBirthdaysClick
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
      onClick: handleScheduleClick
    },
    {
      label: 'תרומה למכינה',
      url: '#',
      icon: <HeartIcon className="w-5 h-5 text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/30',
      isExternal: false,
      onClick: handleDonationClick
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
      {/* Donation Modal and Schedule Modal omitted for brevity, same as original */}
      {/* Same as original... */}
      {showDonation && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowDonation(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDonation(false)} className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <XIcon className="w-6 h-6" />
            </button>
            <div className="text-center mb-6 mt-2">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600 dark:text-red-400">
                <HeartIcon className="w-8 h-8 fill-current" />
              </div>
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
          <div className="w-full h-full overflow-auto flex items-center justify-center p-2" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onClick={(e) => { if (zoom > 1.1) e.stopPropagation(); }}>
            <img src="https://i.postimg.cc/VL8VvCWj/lwz.jpg" alt="לוח זמנים שבועי" className={`rounded-lg shadow-2xl transition-transform duration-75 ease-out ${zoom <= 1 ? 'max-w-full max-h-[90vh] object-contain' : ''}`} style={zoom > 1 ? { width: `${zoom * 100}%`, maxWidth: 'none' } : {}} onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden="true" />

      <div className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{APP_CONFIG.NAME}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><XIcon className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 py-6">
          <nav className="space-y-3">
            {menuItems.map((item, index) => (
              <a key={index} href={item.url} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined} onClick={item.onClick || onClose} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all group cursor-pointer">
                <div className={`p-2.5 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <div className="flex-1"><span className="font-bold text-gray-700 dark:text-gray-200 block text-lg">{item.label}</span></div>
                <ChevronLeftIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400" />
              </a>
            ))}
          </nav>
          <hr className="my-6 border-gray-100 dark:border-gray-700" />
          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>{isDark ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}</div>
                <span className="font-bold text-gray-700 dark:text-gray-200">{isDark ? 'מצב כהה' : 'מצב בהיר'}</span>
             </div>
             <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
               <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${isDark ? '-translate-x-6' : 'translate-x-0'}`} />
             </div>
          </button>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400 dark:text-gray-500">גרסה 1.0.1</div>
      </div>
    </>
  );
};

export default Sidebar;
