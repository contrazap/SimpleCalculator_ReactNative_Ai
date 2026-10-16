import { fireEvent, render, screen } from '@testing-library/react-native';

import { Display } from '@/components/Display';

describe('Display', () => {
  it('shows the expression and the result', async () => {
    await render(
      <Display
        display={{
          expressionLine: '12+3 =',
          mainLine: '15',
          isError: false,
          isPreview: false,
        }}
        onLongPress={jest.fn()}
      />,
    );
    expect(screen.getByText('12+3 =')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByLabelText('Result 15')).toBeTruthy();
  });

  it('announces errors', async () => {
    await render(
      <Display
        display={{
          expressionLine: '5÷0',
          mainLine: 'E',
          isError: true,
          isPreview: false,
        }}
        onLongPress={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('Error')).toBeTruthy();
  });

  it('copies on long press', async () => {
    const onLongPress = jest.fn();
    await render(
      <Display
        display={{
          expressionLine: '',
          mainLine: '0',
          isError: false,
          isPreview: false,
        }}
        onLongPress={onLongPress}
      />,
    );
    await fireEvent(screen.getByLabelText('Result 0'), 'longPress');
    expect(onLongPress).toHaveBeenCalled();
  });
});
