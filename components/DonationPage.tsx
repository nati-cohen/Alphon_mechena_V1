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
      // Fallback
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

  const allDonationDetailsText = `*תרומות למכינה*

*לתרומה באשראי ובביט:*
https://donation.asakimerp.com/Campaing/?CampaingID=51105

*לתרומה בפיבוקס:*
https://payboxapp.page.link/ZQ636TG4CYMFGPd48

*לתרומה בהעברה בנקאית:*
בנק 26 יובנק
סניף 288 קרן היסוד
ח-ן 417793
ע"ש קרית הישיבה בית אל - מכינה קדם צבאית

לפרטים נוספים: 
בצלאל דוכן 
0506713009`;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* סרגל עליון */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all flex items-center gap-1.5"
          aria-label="חזרה לדף הבית"
        >
          <ArrowRightIcon className="w-5 h-5" />
          <span className="text-sm font-bold">חזרה</span>
        </button>
        
        <h1 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
          <HeartIcon className="w-5 h-5 text-red-500 fill-current" />
          תרומות למכינה
        </h1>

        <div className="w-9 flex justify-center items-center">
          <button 
            onClick={() => copyToClipboard(allDonationDetailsText, 'all_details')}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors active:scale-95"
            title="העתק פרטים לשיתוף"
          >
            {copiedField === 'all_details' ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* תוכן נגלל */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 no-scrollbar">
        {/* כרטיס ברכה / פתיחה */}
        <div className="bg-gradient-to-br from-red-500 via-pink-600 to-rose-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden text-right">
          <div className="absolute -left-6 -bottom-6 opacity-15 pointer-events-none">
            <HeartIcon className="w-36 h-36 fill-current" />
          </div>
          <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
            שותפים לדרך ולעשייה
          </span>
          <h2 className="text-xl font-black mb-1.5">תרומה למכינת בית אל</h2>
          <p className="text-red-100 text-xs leading-relaxed max-w-sm">
            תרומתכם שותפה בהצמחת דור העתיד של לוחמים, מפקדים ומנהיגים בעם ישראל. תודה על השותפות והתמיכה!
          </p>
        </div>

        {/* כפתור בולט להעתקת פרטים */}
        <button
          onClick={() => copyToClipboard(allDonationDetailsText, 'all_details_main')}
          className="w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] transition-all text-gray-700 dark:text-gray-200"
        >
          {copiedField === 'all_details_main' || copiedField === 'all_details' ? (
            <>
              <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-600 dark:text-green-400">
                <CheckIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">כל הפרטים הועתקו בהצלחה!</span>
            </>
          ) : (
            <>
              <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg text-gray-500 dark:text-gray-400">
                <CopyIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold">העתקת כל פרטי התרומה לשיתוף</span>
            </>
          )}
        </button>

        {/* 1. כרטיס אשראי וביט */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-right transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
              מאובטח ומהיר
            </span>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-gray-800 dark:text-white text-base">תרומה באשראי ובביט</h3>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3.5">
            סליקה מאובטחת במערכת העמותה, קבלה דיגיטלית מיידית מוכרת לצורכי מס (סעיף 46).
          </p>
          <a
            href="https://donation.asakimerp.com/Campaing/?CampaingID=51105"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all text-sm"
          >
            <span>מעבר לתרומה באשראי / ביט</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>

        {/* 2. כרטיס PayBox (פיבוקס) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-right transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2.5 py-0.5 rounded-full">
              באפליקציה
            </span>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-gray-800 dark:text-white text-base">תרומה ב-PayBox (פיבוקס)</h3>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <SmartphoneIcon className="w-5 h-5" />
              </div>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3.5">
            תרומה נוחה וישירה דרך אפליקציית PayBox במכשיר הנייד.
          </p>
          <a
            href="https://payboxapp.page.link/ZQ636TG4CYMFGPd48"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 active:from-cyan-800 active:to-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all text-sm"
          >
            <span>מעבר לתרומה ב-PayBox</span>
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>

        {/* 3. כרטיס העברה בנקאית */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-right transition-all">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => copyToClipboard(bankDetailsFull, 'all_bank')}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 px-2.5 py-1 rounded-lg transition-all active:scale-95"
            >
              {copiedField === 'all_bank' ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                  <span>הועתק!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-3.5 h-3.5" />
                  <span>העתק הכל</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-gray-800 dark:text-white text-base">העברה בנקאית</h3>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <BankIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3.5 space-y-2.5 text-xs border border-gray-100 dark:border-gray-600/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 font-medium">בנק:</span>
              <span className="font-bold text-gray-800 dark:text-white">יובנק (26)</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-600/40 pt-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">סניף:</span>
              <span className="font-bold text-gray-800 dark:text-white">288 (קרן היסוד)</span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-600/40 pt-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">מספר חשבון:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard('417793', 'account')}
                  className="p-1 rounded text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                  title="העתק מספר חשבון"
                >
                  {copiedField === 'account' ? (
                    <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <CopyIcon className="w-3.5 h-3.5" />
                  )}
                </button>
                <span className="font-black text-gray-900 dark:text-white text-sm tracking-wider">417793</span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 border-t border-gray-100 dark:border-gray-600/40 pt-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">ע"ש החשבון:</span>
              <span className="font-bold text-gray-800 dark:text-white">
                קרית הישיבה בית אל - מכינה קדם צבאית
              </span>
            </div>
          </div>
        </div>

        {/* 4. לפרטים נוספים ובירורים */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-right transition-all">
          <div className="flex items-center justify-end gap-2.5 mb-2">
            <h3 className="font-bold text-gray-800 dark:text-white text-base">לפרטים נוספים ובירורים</h3>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PhoneIcon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mb-4">
            <p className="font-bold text-gray-800 dark:text-white text-sm">בצלאל דוכן</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">050-6713009</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="https://wa.me/972506713009?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%91%D7%A6%D7%9C%D7%90%D7%9C%2C%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%91%D7%A0%D7%95%D7%92%D7%A2%20%D7%9C%D7%AA%D7%A8%D7%95%D7%9E%D7%94%20%D7%9C%D7%9E%D7%9B%D7%99%D7%A0%D7%AA%20%D7%91%D7%99%D7%AA%20%D7%90%D7%9C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl shadow-sm active:scale-[0.98] transition-all text-xs"
            >
              <WhatsappIcon className="w-4 h-4" />
              <span>הודעה בווטסאפ</span>
            </a>

            <a
              href="tel:0506713009"
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 text-gray-800 dark:text-white font-bold py-2.5 px-3 rounded-xl shadow-sm active:scale-[0.98] transition-all text-xs"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>התקשרות</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
