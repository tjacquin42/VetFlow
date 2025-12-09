import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  ScrollView,
} from 'react-native';
import { ReactNode } from 'react';

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: ReactNode;
  /** Footer content (actions/buttons) */
  footer?: ReactNode;
}

/**
 * Reusable Modal component for React Native
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center p-4"
        onPress={onClose}
      >
        {/* Modal panel */}
        <Pressable
          className="bg-white rounded-xl w-full max-w-lg"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-secondary-200">
            <Text className="text-xl font-semibold text-secondary-900">
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              className="text-secondary-400 active:text-secondary-600 p-1"
            >
              <Text className="text-2xl">×</Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView className="p-6 max-h-96">{children}</ScrollView>

          {/* Footer */}
          {footer && (
            <View className="flex-row items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
              {footer}
            </View>
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
