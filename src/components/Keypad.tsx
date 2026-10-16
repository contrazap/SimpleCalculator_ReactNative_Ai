import { StyleSheet, View } from 'react-native';

import type { KeyLayout } from '@/constants/keys';
import type { CalculatorAction } from '@/state/actions';
import { spacing } from '@/theme/tokens';

import { Key } from './Key';

type Props = {
  layout: KeyLayout;
  onPress: (action: CalculatorAction) => void;
};

export function Keypad({ layout, onPress }: Props) {
  return (
    <View style={styles.keypad}>
      {layout.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((keyDef) => (
            <Key key={keyDef.id} keyDef={keyDef} onPress={onPress} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    flex: 1,
    gap: spacing.sm,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
