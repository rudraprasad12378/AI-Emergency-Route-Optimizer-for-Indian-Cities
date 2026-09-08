import React, { useState } from 'react';

export const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div
          className={`
            pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 border border-slate-700/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-xl
            animate-in fade-in zoom-in-95 duration-150
            ${positionClasses[position] || positionClasses.top}
            ${className}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
