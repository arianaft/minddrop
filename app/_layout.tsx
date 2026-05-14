import { Slot, Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="nueva-nota"
            options={{
              title: 'Nueva entrada',
              presentation: 'modal',
            }}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}