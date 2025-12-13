import React, { useEffect, useState, useRef } from 'react';
import { XIcon, WrenchIcon, CalendarIcon, MailIcon, ChevronLeftIcon } from './Icons';
import { APP_CONFIG } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [zoom, setZoom] = useState(1);
  const pinchRef = useRef({ startDist: 0, startZoom: 1 });

  // Prevent background scrolling when menu or modal is open
  useEffect(() => {
    if (isOpen || showSchedule) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showSchedule]);

  // Reset zoom when opening/closing
  useEffect(() => {
    if (!showSchedule) setZoom(1);
  }, [showSchedule]);

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setShowSchedule(true);
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
      setZoom(Math.min(Math.max(1, newZoom), 5)); // Clamp zoom between 1x and 5x
    }
  };

  const menuItems = [
    {
      label: 'טופס תיקונים',
      url: 'https://did.li/takalut-mechina',
      icon: <WrenchIcon className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50',
      isExternal: true
    },
    {
      label: 'לו"ז שבועי',
      url: '#',
      icon: <CalendarIcon className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50',
      isExternal: false,
      onClick: handleScheduleClick
    },
    {
      label: 'צור קשר',
      url: 'https://did.li/Contact-us1',
      icon: <MailIcon className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50',
      isExternal: true
    }
  ];

  return (
    <>
      {/* Schedule Modal */}
      {showSchedule && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center animate-fadeIn"
          onClick={() => setShowSchedule(false)}
        >
          <button 
            onClick={() => setShowSchedule(false)}
            className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-20"
          >
            <XIcon className="w-6 h-6" />
          </button>
          
          <div 
            className="w-full h-full overflow-auto flex items-center justify-center p-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={(e) => {
               // If zoomed in, allow clicking to drag without closing
               if (zoom > 1.1) e.stopPropagation();
            }}
          >
            <img 
              src="https://i.postimg.cc/VL8VvCWj/lwz.jpg" 
              alt="לוח זמנים שבועי" 
              className={`rounded-lg shadow-2xl transition-transform duration-75 ease-out ${zoom <= 1 ? 'max-w-full max-h-[90vh] object-contain' : ''}`}
              style={zoom > 1 ? { width: `${zoom * 100}%`, maxWidth: 'none' } : {}}
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
          
          {zoom <= 1 && (
            <div className="absolute bottom-10 text-white/50 text-sm pointer-events-none">
              ניתן להגדיל עם שתי אצבעות
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">{APP_CONFIG.NAME}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 py-6">
          <nav className="space-y-3">
            {menuItems.map((item, index) => (
              <a 
                key={index}
                href={item.url}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                onClick={item.onClick || onClose}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer"
              >
                <div className={`p-2.5 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-gray-700 block text-lg">{item.label}</span>
                </div>
                <ChevronLeftIcon className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
              </a>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400">
           גרסה 1.0.0
        </div>
      </div>
    </>
  );
};

export default Sidebar;