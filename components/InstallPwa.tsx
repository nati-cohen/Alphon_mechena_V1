import React, { useEffect, useState } from 'react';
import { XIcon } from './Icons';

const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
};

const DISMISSED_KEY = 'pwa_prompt_dismissed_v2';

export const InstallPwa: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    try {
      if (localStorage.getItem(DISMISSED_KEY) === 'true') {
        return;
      }
    } catch {
      // In case localStorage is blocked
    }

    // זיהוי iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIosDevice) {
      setIsIOS(true);
    }

    // הצגת הבאנר בעדינות לאחר 3 שניות של גלישה פעילה
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      setShowBanner(true);
      clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    try {
      localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // Ignore
    }
  };

  const handleInstallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (supportsPWA && promptInstall) {
      promptInstall.prompt();
      promptInstall.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          handleClose();
        }
      });
    } else if (isIOS) {
      setShowIosTip(!showIosTip);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-sm z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-800 shadow-xl rounded-2xl p-3 flex flex-col gap-2 transition-all animate-slideUp">
      <div className="flex items-center gap-3">
        <img 
          src="https://i.postimg.cc/6QtbGKVS/lwgw-mkynh.jpg" 
          alt="לוגו המכינה" 
          className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-stone-800 shrink-0 shadow-sm"
        />

        <div className="flex-1 min-w-0 text-right">
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
            התקנת אלפון בית אל
          </h4>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
            גישה מהירה ישירות ממסך הבית
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            {isIOS && !supportsPWA ? 'כיצד להתקין?' : 'התקן'}
          </button>
          
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIosTip && isIOS && (
        <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/80 p-2.5 rounded-xl text-right leading-relaxed border border-stone-200/70 dark:border-stone-700">
          לחץ על כפתור השיתוף בתחתית הדפדפן (ריבוע עם חץ) ובחר <strong>״הוסף למסך הבית״</strong>.
        </div>
      )}
    </div>
  );
};

export default InstallPwa;
