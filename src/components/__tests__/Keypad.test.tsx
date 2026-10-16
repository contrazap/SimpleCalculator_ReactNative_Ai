import { render, screen } from '@testing-library/react-native';

import { Keypad } from '@/components/Keypad';
import {
  KEYS,
  LANDSCAPE_LAYOUT,
  PORTRAIT_LAYOUT,
  type KeyLayout,
} from '@/constants/keys';

const ALL_LABELS = Object.values(KEYS).map((key) => key.accessibilityLabel);

describe.each<[string, KeyLayout]>([
  ['portrait', PORTRAIT_LAYOUT],
  ['landscape', LANDSCAPE_LAYOUT],
])('Keypad (%s)', (_, layout) => {
  it('renders every key exactly once as an accessible button', async () => {
    await render(<Keypad layout={layout} onPress={jest.fn()} />);
    for (const label of ALL_LABELS) {
      expect(screen.getAllByRole('button', { name: label })).toHaveLength(1);
    }
  });

  it('fills every row to the column count', () => {
    for (const row of layout.rows) {
      const width = row.reduce((sum, key) => sum + (key.span ?? 1), 0);
      expect(width).toBe(layout.columns);
    }
  });
});
