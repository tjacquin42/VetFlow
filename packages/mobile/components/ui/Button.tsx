import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
  View,
} from 'react-native';
import { ReactNode } from 'react';

export interface ButtonProps extends PressableProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
  /** Button content */
  children: string | ReactNode;
  /** Whether button is disabled */
  disabled?: boolean;
}

/**
 * Reusable Button component for React Native
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const baseClass = 'flex-row items-center justify-center gap-2 rounded-lg';

  const variantClasses = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary-200 active:bg-secondary-300',
    ghost: 'active:bg-secondary-100',
    danger: 'bg-danger-600 active:bg-danger-700',
  };

  const textVariantClasses = {
    primary: 'text-white font-medium',
    secondary: 'text-secondary-900 font-medium',
    ghost: 'text-secondary-700 font-medium',
    danger: 'text-white font-medium',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      disabled={isDisabled}
      className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === 'primary' || variant === 'danger' ? '#ffffff' : '#111827'
          }
        />
      ) : null}
      <Text className={`${textVariantClasses[variant]} ${textSizeClasses[size]}`}>
        {children}
      </Text>
    </Pressable>
  );
}
