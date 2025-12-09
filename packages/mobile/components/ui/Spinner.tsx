import { ActivityIndicator, View, ViewProps } from 'react-native';

export interface SpinnerProps extends ViewProps {
  /** Size variant */
  size?: 'small' | 'large';
  /** Custom color */
  color?: string;
}

/**
 * Reusable loading Spinner component for React Native
 */
export function Spinner({
  size = 'large',
  color = '#2563eb',
  ...props
}: SpinnerProps) {
  return (
    <View className="inline-flex items-center justify-center" {...props}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
