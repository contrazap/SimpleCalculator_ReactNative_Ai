import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DISPLAY_DIGITS } from '@/engine/format';
import type { DisplayModel } from '@/state/selectors';
import {
  colors,
  fonts,
  fontSizes,
  MAX_FONT_SCALE,
  metrics,
  radii,
  spacing,
} from '@/theme/tokens';

type Props = {
  display: DisplayModel;
  onLongPress: () => void;
  compact?: boolean;
};

/** Digits occupy LCD cells; "." shares a cell with its digit in DSEG7. */
const cellCount = (text: string) => text.replace('.', '').length;

export function Display({ display, onLongPress, compact = false }: Props) {
  const cells = Math.max(DISPLAY_DIGITS, cellCount(display.mainLine));
  const baseSize = compact
    ? fontSizes.lcdMain * metrics.lcdCompactScale
    : fontSizes.lcdMain;
  // Shrink long values so they always fit, keeping the ghost digits aligned.
  const mainSize = (baseSize * DISPLAY_DIGITS) / cells;
  const mainStyle = {
    fontSize: mainSize,
    lineHeight: mainSize * metrics.lcdLineHeightRatio,
  };

  const spoken = display.isError
    ? 'Error'
    : `${display.isPreview ? 'Preview' : 'Result'} ${display.mainLine}`;

  return (
    <Pressable
      accessibilityRole="text"
      accessibilityLabel={spoken}
      accessibilityHint="Long press to copy the result"
      accessibilityLiveRegion="polite"
      onLongPress={onLongPress}
      style={[styles.lcd, compact && styles.lcdCompact]}
    >
      <Text
        style={styles.expression}
        numberOfLines={1}
        ellipsizeMode="head"
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {display.expressionLine || ' '}
      </Text>
      <View style={styles.mainRow}>
        <Text
          style={[styles.main, styles.ghost, mainStyle]}
          allowFontScaling={false}
        >
          {'8'.repeat(cells)}
        </Text>
        <Text
          style={[styles.main, mainStyle, display.isPreview && styles.preview]}
          allowFontScaling={false}
          numberOfLines={1}
        >
          {display.mainLine}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lcd: {
    backgroundColor: colors.lcd,
    borderRadius: radii.lcd,
    borderTopWidth: metrics.lcdBevelTop,
    borderLeftWidth: metrics.lcdBevelLeft,
    borderColor: colors.lcdShadow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  lcdCompact: {
    paddingVertical: spacing.xs,
    gap: 0,
  },
  expression: {
    fontFamily: fonts.label,
    fontSize: fontSizes.lcdExpression,
    color: colors.lcdMuted,
    textAlign: 'right',
  },
  mainRow: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  main: {
    fontFamily: fonts.lcd,
    color: colors.lcdText,
    textAlign: 'right',
  },
  ghost: {
    position: 'absolute',
    right: 0,
    color: colors.lcdGhost,
  },
  preview: {
    color: colors.lcdMuted,
  },
});
