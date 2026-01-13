
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Student } from '../types';
import { PhoneIcon, WhatsappIcon, CopyIcon, ArrowRightIcon, CakeIcon, XIcon } from './Icons';

interface StudentDetailProps {
  students: Student[];
}

const StudentDetail: React.FC<StudentDetailProps> = ({ students }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // מצב לניהול המודאל של התמונה

  useEffect(() => {
    const found = students.find((s) => s.id === id);
    setStudent(found || null);
  }, [id, students]);

  // מניעת גלילה של הדף כשהתמונה מוגדלת
  useEffect(() => {
    if (isImageModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isImageModalOpen]);

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
        טוען תלמיד...
      </div>
    );
  }

  const handleCall = () => {
    window.open(`tel:${student.phone_number}`, '_self');
  };

  const handleWhatsApp = () => {
    let cleanNum = student.phone_number.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '972' + cleanNum.substring(1);
    }
    window.open(`https://wa.me/${cleanNum}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(student.phone_number).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* מודאל תמונה מוגדלת */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            onClick={() => setIsImageModalOpen(false)}
          >
            <XIcon className="w-8 h-8" />
          </button>
          <div className="max-w-full max-h-[80vh] relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img 
              src={student.image_url} 
              alt={student.full_name} 
              className="rounded-2xl w-full h-full object-contain border-4 border-white/10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(student.full_name)}`;
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10 transition-colors">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRightIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">פרטי איש קשר</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center animate-fadeIn">
        <div className="relative mb-6">
          <div 
            className="w-32 h-32 rounded-full p-1 bg-white dark:bg-gray-800 shadow-lg cursor-pointer transform active:scale-95 transition-all hover:ring-4 hover:ring-blue-500/20"
            onClick={() => setIsImageModalOpen(true)} // לחיצה להגדלה
          >
             <img 
              src={student.image_url} 
              alt={student.full_name} 
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodeURIComponent(student.full_name)}`;
              }}
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-800 shadow-md">
            <SearchIcon className="w-3 h-3" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 text-center">{student.full_name}</h1>
        <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-4 py-1 rounded-full text-sm font-medium mb-8">
          {student.class}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
          <button 
            onClick={handleCall}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <PhoneIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">חיוג</span>
          </button>

          <button 
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
              <WhatsappIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">וואטסאפ</span>
          </button>

          <button 
            onClick={handleCopy}
            className="relative flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
          >
             <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CopyIcon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {copyFeedback ? 'הועתק!' : 'העתק'}
            </span>
          </button>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
             <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1 text-right">מספר טלפון</label>
             <p className="text-lg font-medium text-gray-800 dark:text-gray-100 dir-ltr text-right">{student.phone_number}</p>
          </div>

          {student.birthday_hebrew && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors flex items-center justify-between">
               <div className="text-right">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">תאריך יום הולדת עברי</label>
                  <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{student.birthday_hebrew}</p>
               </div>
               <CakeIcon className="w-8 h-8 text-pink-100 dark:text-gray-700" />
            </div>
          )}

          {student.notes && (
             <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1 text-right">הערות</label>
                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed text-right">{student.notes}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ייבוא אייקון חיפוש לשימוש בתוך הרכיב
const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default StudentDetail;
