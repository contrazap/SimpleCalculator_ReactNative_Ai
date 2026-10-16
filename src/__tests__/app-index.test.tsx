import { render, screen } from '@testing-library/react-native';

import CalculatorScreen from '@/app/index';

describe('CalculatorScreen (scaffold placeholder)', () => {
  it('renders the brand name', async () => {
    await render(<CalculatorScreen />);
    expect(screen.getByText('SIMPLECALC')).toBeTruthy();
  });
});
