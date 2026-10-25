import React, { useEffect } from 'react';
import { XIcon } from './Icons';
import { Student } from '../types';
import Avatar from './Avatar';

interface ImageLightboxProps {
  student: Student | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ student, onClose }) => {
  useEffect(() => {
    if (!student) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [student, onClose]);

  if (!student) return null;

  const hasRealImage = student.image_url && !student.image_url.includes('ui-avatars.com');

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`תמונת ${student.full_name}`}
    >
      {/* כפתור סגירה מהיר */}
      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="סגירה"
      >
        <XIcon className="w-6 h-6" />
      </button>

      <div
        className="max-w-sm w-full bg-stone-900 border border-stone-800 rounded-3xl p-5 flex flex-col items-center text-center shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden mb-4 bg-stone-950 flex items-center justify-center border border-stone-800 shadow-inner">
          {hasRealImage ? (
            <img
              src={student.image_url}
              alt={student.full_name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Avatar
              name={student.full_name}
              sizeClassName="w-32 h-32 text-4xl"
              className="border-2 border-stone-700"
            />
          )}
        </div>

        <h3 className="text-xl font-heading font-bold text-white mb-1">{student.full_name}</h3>
        {student.class && (
          <p className="text-sm font-medium text-amber-400 mb-1">{student.class}</p>
        )}
        {student.phone_number && (
          <p className="text-xs text-stone-400 dir-ltr">{student.phone_number}</p>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium transition-colors"
        >
          סגור
        </button>
      </div>
    </div>
  );
};

export default ImageLightbox;
