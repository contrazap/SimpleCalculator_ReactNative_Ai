import { useRouter } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/BrandHeader';
import { Display } from '@/components/Display';
import { Keypad } from '@/components/Keypad';
import { LANDSCAPE_LAYOUT, PORTRAIT_LAYOUT } from '@/constants/keys';
import { useCalculator } from '@/hooks/useCalculator';
import { colors, radii, spacing } from '@/theme/tokens';

export default function CalculatorScreen() {
  const router = useRouter();
  const { display, press, copyResult } = useCalculator();
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.body, landscape && styles.bodyLandscape]}>
        {!landscape && (
          <BrandHeader
            onHistory={() => router.push('/history')}
            onSettings={() => router.push('/settings')}
          />
        )}
        <Display
          display={display}
          onLongPress={copyResult}
          compact={landscape}
        />
        <Keypad
          layout={landscape ? LANDSCAPE_LAYOUT : PORTRAIT_LAYOUT}
          onPress={press}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bodyEdge,
  },
  body: {
    flex: 1,
    margin: spacing.sm,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.body,
    borderRadius: radii.body,
    borderTopWidth: 1,
    borderTopColor: colors.bodyHighlight,
  },
  bodyLandscape: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
});
