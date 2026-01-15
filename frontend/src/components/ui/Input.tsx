import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = `w-full px-3 py-2 bg-slate-800 text-slate-200 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 ${
    error
      ? 'border-red-500 focus:border-red-500'
      : 'border-slate-600 focus:border-blue-500'
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-200 mb-1">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;