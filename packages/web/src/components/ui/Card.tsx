import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Card content */
  children: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
  /** Hoverable state (adds hover effect) */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Reusable Card component for content containers
 */
export function Card({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-secondary-200',
    outlined: 'bg-white border-2 border-primary-500',
    elevated: 'bg-white shadow-lg border border-secondary-100',
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const clickableClass = onClick || hoverable
    ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        paddingStyles[padding],
        clickableClass,
        className
      )}
      {...props}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-secondary-200">{footer}</div>
      )}
    </div>
  );
}
