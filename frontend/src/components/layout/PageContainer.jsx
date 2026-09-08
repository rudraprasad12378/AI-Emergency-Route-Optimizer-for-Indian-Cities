import React from 'react';

export const PageContainer = ({
  title,
  subtitle,
  actions,
  children,
  fluid = false,
  className = '',
}) => {
  return (
    <div className={`flex-1 p-4 sm:p-6 lg:p-8 space-y-6 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            {title && <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{title}</h1>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <div className={fluid ? 'w-full' : 'max-w-7xl mx-auto'}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
