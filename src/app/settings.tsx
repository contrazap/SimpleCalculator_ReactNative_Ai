import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/hooks/useSettings';
import {
  colors,
  fonts,
  fontSizes,
  MAX_FONT_SCALE,
  spacing,
} from '@/theme/tokens';

export default function SettingsScreen() {
  const { hapticsEnabled, setHapticsEnabled } = useSettings();

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      <View style={styles.row}>
        <View style={styles.labels}>
          <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            Vibrate on key press
          </Text>
          <Text style={styles.caption} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            Light haptic feedback for every key
          </Text>
        </View>
        <Switch
          accessibilityLabel="vibrate on key press"
          value={hapticsEnabled}
          onValueChange={setHapticsEnabled}
          trackColor={{ true: colors.switchTrack, false: colors.divider }}
          thumbColor={colors.text}
        />
      </View>
      <Text style={styles.footer} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        Tip: long-press the display to copy the result.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screen,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  labels: {
    flex: 1,
    gap: spacing.xxs,
  },
  label: {
    fontFamily: fonts.labelBold,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.label,
    fontSize: fontSizes.caption,
    color: colors.textMuted,
  },
  footer: {
    fontFamily: fonts.label,
    fontSize: fontSizes.caption,
    color: colors.textMuted,
  },
});
