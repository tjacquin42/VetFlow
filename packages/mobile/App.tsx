import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-secondary-50">
      <Text className="text-3xl font-bold text-primary-600 mb-2">
        VetFlow Mobile
      </Text>
      <Text className="text-base text-secondary-600 px-8 text-center">
        Application mobile en cours de développement
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
