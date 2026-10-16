import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HistoryList } from '@/components/HistoryList';
import { useCalculator } from '@/hooks/useCalculator';
import { useHistory } from '@/hooks/useHistory';
import {
  colors,
  fonts,
  fontSizes,
  MAX_FONT_SCALE,
  spacing,
} from '@/theme/tokens';

export default function HistoryScreen() {
  const router = useRouter();
  const { entries, clearHistory } = useHistory();
  const { load } = useCalculator();

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerRight: () =>
            entries.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="clear history"
                onPress={clearHistory}
                hitSlop={spacing.sm}
              >
                <Text
                  style={styles.clear}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  CLEAR
                </Text>
              </Pressable>
            ) : null,
        }}
      />
      <HistoryList
        entries={entries}
        onSelect={(entry) => {
          load(entry.expression);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  clear: {
    fontFamily: fonts.labelBold,
    fontSize: fontSizes.body,
    color: colors.brandAccent,
  },
});
