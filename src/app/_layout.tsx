import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { CalculatorProvider } from '@/hooks/useCalculator';
import { HistoryProvider } from '@/hooks/useHistory';
import { SettingsProvider } from '@/hooks/useSettings';
import { colors, fonts } from '@/theme/tokens';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.lcd]: require('../../assets/fonts/DSEG7Classic-Regular.ttf'),
    [fonts.label]: require('../../assets/fonts/SairaCondensed-Regular.ttf'),
    [fonts.labelBold]: require('../../assets/fonts/SairaCondensed-Bold.ttf'),
  });
  // Fall back to system fonts rather than hanging on the splash screen.
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <SettingsProvider>
      <HistoryProvider>
        <CalculatorProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.body },
              headerTintColor: colors.text,
              headerTitleStyle: { fontFamily: fonts.labelBold },
              contentStyle: { backgroundColor: colors.screen },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="history" options={{ title: 'History' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          </Stack>
        </CalculatorProvider>
      </HistoryProvider>
    </SettingsProvider>
  );
}
