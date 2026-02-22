import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  rows?: number;
}

/**
 * Mobile-optimized textarea
 * - Min 44px height (expands with content)
 * - Auto-resize capability
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  rows = 3,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        rows={rows}
        className={`
          w-full min-h-[88px] px-4 py-3
          bg-white border rounded-lg
          text-base text-gray-900
          placeholder:text-gray-400
          resize-vertical
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:text-gray-500
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
