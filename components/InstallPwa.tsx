import React, { useEffect, useState } from 'react';
import { XIcon } from './Icons';

const InstallPwa: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // זיהוי אנדרואיד/דסקטופ שתומכים בהתקנה אוטומטית
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // זיהוי iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // בדיקה אם האפליקציה כבר מותקנת (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  if (!showBanner) return null;

  // תצוגה לאנדרואיד/כרום
  if (supportsPWA) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-2xl z-50 flex items-center justify-between animate-fadeIn">
        <div className="flex flex-col">
          <span className="font-bold text-sm">התקן את האלפון</span>
          <span className="text-xs text-gray-400">גישה מהירה ללא צורך באינטרנט</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowBanner(false)}
            className="text-gray-400 hover:text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            onClick={onClick}
          >
            התקן
          </button>
        </div>
      </div>
    );
  }

  // תצוגה ל-iOS (רק אם המשתמש עוד לא התקין)
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 p-4 z-50 animate-slideUp text-center">
         <div className="flex justify-between items-start mb-2">
           <p className="text-sm text-gray-600 text-right flex-1">
             להתקנת האפליקציה באייפון: <br/>
             לחץ על כפתור השיתוף <span className="text-xl">⎋</span> ובחר <strong>"הוסף למסך הבית"</strong>
           </p>
           <button onClick={() => setShowBanner(false)} className="text-gray-400 p-1">
             <XIcon className="w-5 h-5" />
           </button>
         </div>
      </div>
    );
  }

  return null;
};

export default InstallPwa;