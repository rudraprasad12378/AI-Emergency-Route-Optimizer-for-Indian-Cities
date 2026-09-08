import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  type = 'text',
  disabled = false,
  required = false,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-lg border bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500
            transition-all duration-200 outline-none
            focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50
            disabled:cursor-not-allowed disabled:bg-slate-950 disabled:text-slate-600
            ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2
            ${error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30' : 'border-slate-800'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
