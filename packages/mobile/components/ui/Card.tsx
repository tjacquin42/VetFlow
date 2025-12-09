import { View, Text, Pressable, ViewProps } from 'react-native';
import { ReactNode } from 'react';

export interface CardProps extends ViewProps {
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
  /** Hoverable state (adds press effect) */
  pressable?: boolean;
  /** Press handler */
  onPress?: () => void;
}

/**
 * Reusable Card component for React Native
 */
export function Card({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  padding = 'md',
  pressable = false,
  onPress,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-secondary-200',
    outlined: 'bg-white border-2 border-primary-500',
    elevated: 'bg-white shadow-lg border border-secondary-100',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = onPress || pressable ? Pressable : View;

  return (
    <Component
      onPress={onPress}
      className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]}`}
      {...props}
    >
      {/* Header */}
      {(title || subtitle) && (
        <View className="mb-4">
          {title && (
            <Text className="text-lg font-semibold text-secondary-900">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-sm text-secondary-500 mt-1">{subtitle}</Text>
          )}
        </View>
      )}

      {/* Content */}
      <View>{children}</View>

      {/* Footer */}
      {footer && (
        <View className="mt-4 pt-4 border-t border-secondary-200">
          {footer}
        </View>
      )}
    </Component>
  );
}
