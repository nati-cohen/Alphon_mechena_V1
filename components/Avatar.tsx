import React, { useState } from 'react';
import { getHebrewInitials } from '../utils/hebrewDate';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
  sizeClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  className = '',
  sizeClassName = '',
  onClick,
  alt
}) => {
  const [hasError, setHasError] = useState(false);
  
  // נבדוק האם יש תמונה אמיתית (שאינה ui-avatars הישן)
  const isGenericOrMissing = !imageUrl || imageUrl.includes('ui-avatars.com') || hasError;

  if (isGenericOrMissing) {
    const initials = getHebrewInitials(name);
    return (
      <div
        onClick={onClick}
        className={`rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold flex items-center justify-center border border-stone-300/70 dark:border-stone-700 select-none shrink-0 ${sizeClassName} ${className}`}
        title={name}
        aria-label={alt || name}
      >
        <span className="tracking-tight">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || name}
      onClick={onClick}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      className={`rounded-full object-cover border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0 ${sizeClassName} ${className}`}
    />
  );
};

export default Avatar;
