import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export interface SelectOption {
  /** Option value */
  value: string;
  /** Option display label */
  label: string;
}

export interface SelectProps {
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
  /** Whether select is disabled */
  disabled?: boolean;
}

/**
 * Reusable Select component for React Native using Picker
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
}: SelectProps) {
  const hasError = Boolean(error);

  return (
    <View className="flex flex-col gap-1.5">
      {/* Label */}
      <Text className="text-sm font-medium text-secondary-700">
        {label}
        {required && <Text className="text-danger-500"> *</Text>}
      </Text>

      {/* Select container */}
      <View
        className={`border rounded-lg overflow-hidden ${
          hasError ? 'border-danger-500' : 'border-secondary-300'
        } ${disabled ? 'bg-secondary-100' : 'bg-white'}`}
      >
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          enabled={!disabled}
        >
          {placeholder && (
            <Picker.Item
              label={placeholder}
              value=""
              enabled={false}
              color="#9ca3af"
            />
          )}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>

      {/* Error message */}
      {error && <Text className="text-sm text-danger-500">{error}</Text>}
    </View>
  );
}
