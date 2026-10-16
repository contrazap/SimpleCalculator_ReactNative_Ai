import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';

import CalculatorScreen from '@/app/index';
import { CalculatorProvider } from '@/hooks/useCalculator';
import { HistoryProvider } from '@/hooks/useHistory';
import { SettingsProvider } from '@/hooks/useSettings';
import { STORAGE_KEYS } from '@/storage/storage';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <HistoryProvider>
        <CalculatorProvider>{children}</CalculatorProvider>
      </HistoryProvider>
    </SettingsProvider>
  );
}

async function pressKeys(...labels: string[]) {
  for (const label of labels) {
    await fireEvent.press(screen.getByRole('button', { name: label }));
  }
}

describe('CalculatorScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    await render(<CalculatorScreen />, { wrapper: Providers });
  });

  it('renders the brand name', () => {
    expect(screen.getByText('SIMPLECALC')).toBeTruthy();
  });

  it('calculates with precedence and shows a live preview', async () => {
    await pressKeys('2', 'plus', '3', 'multiply', '4');
    expect(screen.getByText('2+3×4')).toBeTruthy();
    expect(screen.getByLabelText('Preview 14')).toBeTruthy();

    await pressKeys('equals');
    expect(screen.getByText('2+3×4 =')).toBeTruthy();
    expect(screen.getByLabelText('Result 14')).toBeTruthy();
  });

  it('shows E on division by zero and recovers with AC', async () => {
    await pressKeys('5', 'divide', '0', 'equals');
    expect(screen.getByLabelText('Error')).toBeTruthy();
    await pressKeys('all clear');
    expect(screen.getByLabelText('Result 0')).toBeTruthy();
  });

  it('saves finished calculations to history', async () => {
    await pressKeys('7', 'minus', '2', 'equals');
    await waitFor(async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.history);
      expect(JSON.parse(stored ?? '[]')).toMatchObject([
        { expression: '7−2', result: '5' },
      ]);
    });
  });

  it('gives haptic feedback on key press', async () => {
    await pressKeys('1');
    expect(Haptics.impactAsync).toHaveBeenCalled();
  });

  it('opens history and settings', async () => {
    await pressKeys('history', 'settings');
    expect(mockPush).toHaveBeenNthCalledWith(1, '/history');
    expect(mockPush).toHaveBeenNthCalledWith(2, '/settings');
  });
});
