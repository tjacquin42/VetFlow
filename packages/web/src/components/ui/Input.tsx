import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Input label */
  label: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number';
  /** Current value */
  value: string | number;
  /** Change handler */
  onChange: (value: string) => void;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Required field indicator */
  required?: boolean;
  /** Unit suffix (e.g., "kg", "years") */
  unit?: string;
  /** Icon to display on the left */
  leftIcon?: ReactNode;
}

/**
 * Reusable Input component with label, error, and unit support
 */
export function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  unit,
  leftIcon,
  placeholder,
  className,
  min,
  max,
  step,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
        {label}
        {required && <span className="text-danger-500 ml-1">*</span>}
      </label>

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
            {leftIcon}
          </div>
        )}

        {/* Input field */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 dark:placeholder:text-secondary-500',
            'focus-ring transition-colors',
            'disabled:bg-secondary-100 dark:disabled:bg-secondary-700 disabled:cursor-not-allowed disabled:text-secondary-500',
            leftIcon && 'pl-10',
            unit && 'pr-12',
            hasError
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-500',
            className
          )}
          {...props}
        />

        {/* Unit suffix */}
        {unit && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500 dark:text-secondary-400 text-sm font-medium">
            {unit}
          </div>
        )}
      </div>

      {/* Error or hint message */}
      {error && (
        <p className="text-sm text-danger-500 dark:text-danger-400 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-sm text-secondary-500 dark:text-secondary-400">{hint}</p>}
    </div>
  );
}
