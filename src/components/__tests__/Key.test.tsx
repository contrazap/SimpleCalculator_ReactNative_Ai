import { fireEvent, render, screen } from '@testing-library/react-native';

import { Key } from '@/components/Key';
import { KEYS } from '@/constants/keys';

describe('Key', () => {
  it('is a labelled button that emits its action', async () => {
    const onPress = jest.fn();
    await render(<Key keyDef={KEYS.divide} onPress={onPress} />);

    const button = screen.getByRole('button', { name: 'divide' });
    expect(screen.getByText('÷')).toBeTruthy();

    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledWith({
      type: 'operator',
      operator: 'divide',
    });
  });
});
