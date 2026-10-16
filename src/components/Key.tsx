import { Pressable, StyleSheet, Text } from 'react-native';

import type { KeyDef, KeyVariant } from '@/constants/keys';
import type { CalculatorAction } from '@/state/actions';
import {
  colors,
  fonts,
  fontSizes,
  MAX_FONT_SCALE,
  metrics,
  radii,
} from '@/theme/tokens';

type Props = {
  keyDef: KeyDef;
  onPress: (action: CalculatorAction) => void;
};

const VARIANT_COLORS: Record<
  KeyVariant,
  { base: string; pressed: string; text: string }
> = {
  digit: {
    base: colors.keyDigit,
    pressed: colors.keyDigitPressed,
    text: colors.keyDigitText,
  },
  operator: {
    base: colors.keyOperator,
    pressed: colors.keyOperatorPressed,
    text: colors.keyOperatorText,
  },
  danger: {
    base: colors.keyDanger,
    pressed: colors.keyDangerPressed,
    text: colors.keyDangerText,
  },
  accent: {
    base: colors.keyAccent,
    pressed: colors.keyAccentPressed,
    text: colors.keyAccentText,
  },
};

export function Key({ keyDef, onPress }: Props) {
  const palette = VARIANT_COLORS[keyDef.variant];
  const isSymbol = keyDef.label.length > 1 || keyDef.label === '⌫';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={keyDef.accessibilityLabel}
      onPress={() => onPress(keyDef.action)}
      style={({ pressed }) => [
        styles.key,
        {
          flex: keyDef.span ?? 1,
          backgroundColor: pressed ? palette.pressed : palette.base,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={[
          styles.label,
          isSymbol && styles.smallLabel,
          { color: palette.text },
        ]}
      >
        {keyDef.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.key,
    borderBottomWidth: metrics.keyBevel,
    borderBottomColor: colors.keyShadow,
    elevation: metrics.keyElevation,
  },
  // Rubber-dome feel: the key sinks and loses most of its bevel.
  pressed: {
    transform: [{ translateY: metrics.keyPressOffset }],
    borderBottomWidth: metrics.keyBevelPressed,
    elevation: metrics.keyElevationPressed,
  },
  label: {
    fontFamily: fonts.labelBold,
    fontSize: fontSizes.key,
  },
  smallLabel: {
    fontSize: fontSizes.keySmall,
  },
});
