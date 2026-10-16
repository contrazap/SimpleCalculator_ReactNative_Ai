import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { Platform, ToastAndroid } from 'react-native';

import type { CalculatorAction } from '@/state/actions';
import { calculatorReducer, initialState } from '@/state/calculatorReducer';
import { selectDisplay, type DisplayModel } from '@/state/selectors';

import { useHistory } from './useHistory';
import { useSettings } from './useSettings';

type CalculatorContextValue = {
  display: DisplayModel;
  press: (action: CalculatorAction) => void;
  /** Loads an expression (e.g. from history) without haptic feedback. */
  load: (expression: string) => void;
  copyResult: () => void;
};

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

/**
 * Lives above the router so the calculator keeps its state while the
 * history and settings screens are open.
 */
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const { hapticsEnabled } = useSettings();
  const { addEntry } = useHistory();

  const { lastCommit } = state;
  useEffect(() => {
    if (lastCommit)
      addEntry({
        expression: lastCommit.expression,
        result: lastCommit.result,
      });
  }, [lastCommit, addEntry]);

  const press = useCallback(
    (action: CalculatorAction) => {
      if (hapticsEnabled) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
          () => {},
        );
      }
      dispatch(action);
    },
    [hapticsEnabled],
  );

  const load = useCallback(
    (expression: string) => dispatch({ type: 'load', expression }),
    [],
  );

  const display = useMemo(() => selectDisplay(state), [state]);

  const copyResult = useCallback(() => {
    if (display.isError) return;
    void Clipboard.setStringAsync(display.mainLine).then(() => {
      if (Platform.OS === 'android')
        ToastAndroid.show('Copied', ToastAndroid.SHORT);
    });
  }, [display]);

  const value = useMemo(
    () => ({ display, press, load, copyResult }),
    [display, press, load, copyResult],
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator(): CalculatorContextValue {
  const context = useContext(CalculatorContext);
  if (!context)
    throw new Error('useCalculator must be used inside CalculatorProvider');
  return context;
}
