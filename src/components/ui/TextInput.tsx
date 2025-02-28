import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  helperText?: string;
  error?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
}

/**
 * A reusable text input component with optional label, helper text, error message, and icon.
 */
export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  helperText,
  error,
  icon: Icon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const inputClasses = `
    block
    px-4
    py-2
    w-full
    text-gray-900
    bg-white
    rounded-lg
    border
    border-gray-300
    focus:ring-blue-500
    focus:border-blue-500
    ${error ? 'border-red-500' : ''}
    ${Icon ? 'pl-10' : ''}
    ${className}
  `;

  const containerClasses = `
    relative
    ${fullWidth ? 'w-full' : ''}
  `;

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <input
          id={id}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${id}-description` : undefined}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p
          id={`${id}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
