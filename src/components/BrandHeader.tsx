import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  onHistory: () => void;
  onSettings: () => void;
};

export function BrandHeader({ onHistory, onSettings }: Props) {
  const links = [
    { label: 'HISTORY', accessibilityLabel: 'history', onPress: onHistory },
    { label: 'SETTINGS', accessibilityLabel: 'settings', onPress: onSettings },
  ];

  return (
    <View style={styles.header}>
      <View style={styles.brandBlock}>
        <Text style={styles.brand} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          SIMPLECALC
        </Text>
        <View style={styles.links}>
          {links.map((link) => (
            <Pressable
              key={link.label}
              accessibilityRole="button"
              accessibilityLabel={link.accessibilityLabel}
              onPress={link.onPress}
              hitSlop={spacing.sm}
              style={({ pressed }) => [
                styles.link,
                pressed && styles.linkPressed,
              ]}
            >
              <Text
                style={styles.linkText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {link.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View
        style={styles.solar}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {Array.from({ length: metrics.solarCells }, (_, index) => (
          <View key={index} style={styles.solarCell} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brandBlock: {
    gap: spacing.xxs,
  },
  brand: {
    fontFamily: fonts.labelBold,
    fontSize: fontSizes.brand,
    letterSpacing: metrics.brandLetterSpacing,
    color: colors.brandText,
  },
  links: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  link: {
    paddingVertical: spacing.xxs,
  },
  linkPressed: {
    opacity: metrics.pressedOpacity,
  },
  linkText: {
    fontFamily: fonts.labelBold,
    fontSize: fontSizes.caption,
    letterSpacing: metrics.captionLetterSpacing,
    color: colors.brandAccent,
  },
  solar: {
    flexDirection: 'row',
    backgroundColor: colors.solarCellLine,
    borderRadius: radii.lcd,
    padding: spacing.xxs,
    gap: spacing.xxs,
  },
  solarCell: {
    width: metrics.solarCellWidth,
    height: metrics.solarCellHeight,
    backgroundColor: colors.solarCell,
    borderRadius: metrics.solarCellRadius,
  },
});
