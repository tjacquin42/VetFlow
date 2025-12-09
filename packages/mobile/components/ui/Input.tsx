import { View, Text, TextInput, TextInputProps } from 'react-native';

export interface InputProps extends Omit<TextInputProps, 'onChange'> {
  /** Input label */
  label: string;
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
}

/**
 * Reusable Input component for React Native
 */
export function Input({
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  editable = true,
  unit,
  placeholder,
  keyboardType,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <View className="flex flex-col gap-1.5">
      {/* Label */}
      <Text className="text-sm font-medium text-secondary-700">
        {label}
        {required && <Text className="text-danger-500"> *</Text>}
      </Text>

      {/* Input container */}
      <View className="relative">
        <TextInput
          value={String(value)}
          onChangeText={onChange}
          placeholder={placeholder}
          editable={editable}
          keyboardType={keyboardType}
          className={`w-full px-3 py-2 border rounded-lg text-secondary-900 ${
            !editable ? 'bg-secondary-100 text-secondary-500' : 'bg-white'
          } ${
            hasError
              ? 'border-danger-500'
              : 'border-secondary-300 focus:border-primary-500'
          } ${unit ? 'pr-12' : ''}`}
          placeholderTextColor="#9ca3af"
          {...props}
        />

        {/* Unit suffix */}
        {unit && (
          <View className="absolute right-3 top-1/2 -translate-y-1/2">
            <Text className="text-secondary-500 text-sm font-medium">
              {unit}
            </Text>
          </View>
        )}
      </View>

      {/* Error or hint message */}
      {error && (
        <Text className="text-sm text-danger-500">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-sm text-secondary-500">{hint}</Text>
      )}
    </View>
  );
}
