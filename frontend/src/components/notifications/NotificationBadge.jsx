import React from 'react';

export const NotificationBadge = ({ count = 0, className = '' }) => {
  if (count <= 0) return null;

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm
        ${className}
      `}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default NotificationBadge;
