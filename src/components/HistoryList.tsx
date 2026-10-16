import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { HistoryEntry } from '@/state/history';
import {
  colors,
  fonts,
  fontSizes,
  MAX_FONT_SCALE,
  spacing,
} from '@/theme/tokens';

type Props = {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
};

export function HistoryList({ entries, onSelect }: Props) {
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          No calculations yet
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(entry) => entry.id}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${item.expression} equals ${item.result}`}
          accessibilityHint="Loads this calculation"
          onPress={() => onSelect(item)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <Text
            style={styles.expression}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {item.expression}
          </Text>
          <Text style={styles.result} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            = {item.result}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'flex-end',
    gap: spacing.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowPressed: {
    backgroundColor: colors.rowPressed,
  },
  expression: {
    fontFamily: fonts.label,
    fontSize: fontSizes.body,
    color: colors.textMuted,
    textAlign: 'right',
  },
  result: {
    fontFamily: fonts.labelBold,
    fontSize: fontSizes.title,
    color: colors.text,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: fonts.label,
    fontSize: fontSizes.body,
    color: colors.textMuted,
  },
});
