import React, { useEffect, useState } from 'react';
import { XIcon, MoreVerticalIcon } from './Icons';

// Helper to check if the app is already installed
const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
};

const InstallPwa: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // If already installed, do not show
    if (isStandalone()) return;

    // Check session storage to avoid showing if user closed it this session
    const hasClosed = sessionStorage.getItem('pwa-prompt-closed');
    if (hasClosed) return;

    // Timer to force show the modal if the browser doesn't trigger the event automatically
    // This handles cases like Dev mode, non-supported browsers, or if the user ignored it before
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2500);

    // Android / Desktop PWA prompt
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      setShowModal(true);
      clearTimeout(timer); // Event received, no need to force
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS Detection
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIosDevice) {
      setIsIOS(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setShowModal(false);
    sessionStorage.setItem('pwa-prompt-closed', 'true');
  };

  const handleInstallClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setShowModal(false);
      }
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 animate-fadeIn"
        onClick={handleClose}
      />
      
      {/* Card content */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm m-4 p-5 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 pointer-events-auto animate-slideUp transform transition-all relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
           <img 
             src="https://i.postimg.cc/6QtbGKVS/lwgw-mkynh.jpg" 
             alt="Logo" 
             className="w-20 h-20 rounded-2xl shadow-lg mb-4" 
           />
           
           <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-1">התקנת האפליקציה</h3>
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 px-4">
             התקן את אלפון מכינת בית אל לגישה מהירה ונוחה ישירות ממסך הבית שלך
           </p>

           {/* Case 1: Browser supports automatic install (Chrome Android mostly) */}
           {supportsPWA && (
             <button
               onClick={handleInstallClick}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
             >
               <span>התקן עכשיו</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
             </button>
           )}

           {/* Case 2: iOS Manual Instructions */}
           {isIOS && !supportsPWA && (
             <div className="w-full bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                <div className="flex items-center gap-3 mb-3">
                   <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-600 rounded-lg shadow-sm font-bold text-blue-600 dark:text-blue-300">1</span>
                   <span>לחץ על כפתור השיתוף <span className="inline-block align-middle mx-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></span> למטה</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-600 rounded-lg shadow-sm font-bold text-blue-600 dark:text-blue-300">2</span>
                   <span>גלול ובחר <strong>"הוסף למסך הבית"</strong> (Add to Home Screen)</span>
                </div>
             </div>
           )}

           {/* Case 3: Android/Chrome Manual Instructions (if auto-install fails) */}
           {!supportsPWA && !isIOS && (
             <div className="w-full bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                <div className="flex items-center gap-3 mb-3">
                   <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-600 rounded-lg shadow-sm font-bold text-blue-600 dark:text-blue-300">1</span>
                   <span>לחץ על כפתור התפריט <span className="inline-block align-middle mx-1 bg-white dark:bg-gray-600 rounded p-0.5"><MoreVerticalIcon className="w-3.5 h-3.5" /></span> בדפדפן</span>
                </div>
                <div className="flex items-center gap-3">
                   <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-600 rounded-lg shadow-sm font-bold text-blue-600 dark:text-blue-300">2</span>
                   <span>בחר ב-<strong>"התקן אפליקציה"</strong> או <strong>"הוסף למסך הבית"</strong></span>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default InstallPwa;