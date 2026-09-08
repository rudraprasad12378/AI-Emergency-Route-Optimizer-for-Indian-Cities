import React from 'react';

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 shadow-md shadow-primary-600/20',
  secondary: 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 active:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-md shadow-red-600/20',
  outline: 'bg-transparent text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white',
  ghost: 'bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-md shadow-emerald-600/20',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-xs font-semibold gap-2',
  lg: 'px-5 py-2.5 text-sm font-bold gap-2',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const showLoading = isLoading || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl
        transition-all duration-150 cursor-pointer outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || showLoading}
      {...props}
    >
      {showLoading ? (
        <svg className="animate-spin h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
