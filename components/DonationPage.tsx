import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightIcon, HeartIcon, CreditCardIcon, BankIcon, 
  SmartphoneIcon, PhoneIcon, WhatsappIcon, CopyIcon, 
  CheckIcon, ExternalLinkIcon 
} from './Icons';

export const DonationPage: React.FC = () => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    });
  };

  const bankDetailsFull = `פרטי העברה בנקאית לתרומה:
בנק: יובנק (26)
סניף: 288 (קרן היסוד)
מספר חשבון: 417793
ע"ש: קרית הישיבה בית אל - מכינה קדם צבאית`;

  const allDonationDetailsText = `*תרומות למכינת בית אל*

*באשראי ובביט (סעיף 46):*
https://donation.asakimerp.com/Campaing/?CampaingID=51105

*ב-PayBox:*
https://payboxapp.page.link/ZQ636TG4CYMFGPd48

*בהעברה בנקאית:*
בנק 26 יובנק, סניף 288 קרן היסוד, חשבון 417793
ע"ש קרית הישיבה בית אל - מכינה קדם צבאית

לפרטים: בצלאל דוכן 050-6713009`;

  return (
    <div className="h-full flex flex-col bg-[#FAF8F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* סרגל עליון */}
      <header className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 pt-[calc(0.875rem+env(safe-area-inset-top,0px))] pb-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => navigate('/')} 
          className="px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold"
          aria-label="חזרה לאלפון"
        >
          <ArrowRightIcon className="w-4 h-4" />
          <span>חזרה</span>
        </button>
        
        <h1 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <HeartIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>שותפות ותרומה</span>
        </h1>

        <button 
          onClick={() => copyToClipboard(allDonationDetailsText, 'all_details_nav')}
          className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 transition-colors active:scale-95"
          title="העתק פרטים לשיתוף"
          aria-label="העתק פרטים לשיתוף"
        >
          {copiedField === 'all_details_nav' ? (
            <CheckIcon className="w-4 h-4 text-emerald-600" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
        </button>
      </header>

      {/* תוכן נגלל */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-24 no-scrollbar max-w-md mx-auto w-full">
        {/* כרטיס פתיחה חם ויוקרתי */}
        <div className="bg-stone-900 dark:bg-stone-900/90 text-stone-100 rounded-3xl p-5 border border-stone-800 shadow-md text-right relative overflow-hidden">
          <span className="inline-block text-[11px] font-semibold tracking-wider text-amber-400 uppercase mb-1.5">
            שותפים להצמחת לוחמים ומנהיגים
          </span>
          <h2 className="text-xl font-bold mb-2 text-white">תרומה למכינת בית אל</h2>
          <p className="text-stone-300 text-xs leading-relaxed">
            תרומתכם הישירה שותפה בחיזוק רוח התורה, החינוך וההכשרה הקרבית של תלמידי המכינה לקראת שירות משמעותי ופיקודי בצה״ל.
          </p>
        </div>

        {/* כפתור מהיר להעתקת כל הפרטים לשיתוף */}
        <button
          onClick={() => copyToClipboard(allDonationDetailsText, 'all_details_main')}
          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-600/50 rounded-2xl p-3 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all text-stone-700 dark:text-stone-200"
        >
          {copiedField === 'all_details_main' ? (
            <>
              <CheckIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-600">כל פרטי התרומה הועתקו בהצלחה!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold">העתקת כל פרטי התרומה להודעת וואטסאפ</span>
            </>
          )}
        </button>

        {/* 1. אשראי וביט */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-sm text-right">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
              מוכר לסעיף 46
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">כרטיס אשראי ו-Bit</h3>
              <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                <CreditCardIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs mb-3">
            סליקה מאובטחת במערכת העמותה, קבלה דיגיטלית מוכרת לצורכי מס נשלחת מיידית למייל.
          </p>
          <a
            href="https://donation.asakimerp.com/Campaing/?CampaingID=51105"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold py-2.5 px-4 rounded-xl shadow-sm text-xs transition-all active:scale-[0.98]"
          >
            <span>תשלום מאובטח באשראי או ביט</span>
            <ExternalLinkIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2. PayBox */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-sm text-right">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full">
              באפליקציה
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">אפליקציית PayBox</h3>
              <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                <SmartphoneIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs mb-3">
            תרומה מהירה ישירות מחשבון ה-PayBox שלך.
          </p>
          <a
            href="https://payboxapp.page.link/ZQ636TG4CYMFGPd48"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-[0.98]"
          >
            <span>פתיחה ב-PayBox</span>
            <ExternalLinkIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3. העברה בנקאית */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-sm text-right">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => copyToClipboard(bankDetailsFull, 'all_bank')}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline active:scale-95"
            >
              {copiedField === 'all_bank' ? (
                <>
                  <CheckIcon className="w-3 h-3 text-emerald-600" />
                  <span>הועתק!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-3 h-3" />
                  <span>העתק פרטים</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">העברה בנקאית</h3>
              <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                <BankIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-950/50 rounded-xl p-3 space-y-2 text-xs border border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">בנק:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">יובנק (26)</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-stone-200/60 dark:border-stone-800 pt-1.5">
              <span className="text-stone-500">סניף:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">288 (קרן היסוד)</span>
            </div>

            <div className="flex items-center justify-between border-t border-stone-200/60 dark:border-stone-800 pt-1.5">
              <span className="text-stone-500">מספר חשבון:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyToClipboard('417793', 'account')}
                  className="p-1 rounded text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  title="העתק מספר חשבון"
                >
                  {copiedField === 'account' ? (
                    <CheckIcon className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <CopyIcon className="w-3 h-3" />
                  )}
                </button>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">417793</span>
              </div>
            </div>

            <div className="flex flex-col border-t border-stone-200/60 dark:border-stone-800 pt-1.5">
              <span className="text-stone-500 text-[10px]">ע״ש החשבון:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                קרית הישיבה בית אל - מכינה קדם צבאית
              </span>
            </div>
          </div>
        </div>

        {/* 4. איש קשר ובירורים */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-800 shadow-sm text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">בירורים וקבלות</h3>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <PhoneIcon className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mb-3">
            <p className="font-bold text-stone-900 dark:text-stone-100 text-xs">בצלאל דוכן</p>
            <p className="text-[11px] text-stone-500 font-mono">050-6713009</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/972506713009?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%91%D7%A6%D7%9C%D7%90%D7%9C%2C%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%91%D7%A0%D7%95%D7%92%D7%A2%20%D7%9C%D7%AA%D7%A8%D7%95%D7%9E%D7%94%20%D7%9C%D7%9E%D7%9B%D7%99%D7%A0%D7%AA%20%D7%91%D7%99%D7%AA%20%D7%90%D7%9C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-3 rounded-xl shadow-sm active:scale-[0.98] transition-all text-xs"
            >
              <WhatsappIcon className="w-3.5 h-3.5" />
              <span>וואטסאפ</span>
            </a>

            <a
              href="tel:0506713009"
              className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium py-2 px-3 rounded-xl transition-all active:scale-[0.98] text-xs"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>התקשרות</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationPage;
