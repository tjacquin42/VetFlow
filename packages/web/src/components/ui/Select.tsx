import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  /** Option value */
  value: string;
  /** Option display label */
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  /** Select label */
  label: string;
  /** Available options */
  options: SelectOption[];
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Required field indicator */
  required?: boolean;
}

/**
 * Reusable Select component with label and error support
 */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className,
  ...props
}: SelectProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
        {label}
        {required && <span className="text-danger-500 ml-1">*</span>}
      </label>

      {/* Select container */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 appearance-none',
            'focus-ring focus:scale-[1.01] transition-all duration-150',
            'disabled:bg-secondary-100 dark:disabled:bg-secondary-700 disabled:cursor-not-allowed disabled:text-secondary-500 dark:disabled:text-secondary-400',
            hasError
              ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
              : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-500',
            !value && 'text-secondary-400 dark:text-secondary-500',
            'pr-10', // Space for dropdown icon
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400 dark:text-secondary-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
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
    </div>
  );
}
