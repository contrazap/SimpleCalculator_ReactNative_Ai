import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { loadJSON, saveJSON, STORAGE_KEYS } from '@/storage/storage';

export type Settings = { hapticsEnabled: boolean };

export const DEFAULT_SETTINGS: Settings = { hapticsEnabled: true };

function isSettings(value: unknown): value is Settings {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Settings).hapticsEnabled === 'boolean'
  );
}

type SettingsContextValue = Settings & {
  setHapticsEnabled: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;
    loadJSON(STORAGE_KEYS.settings, DEFAULT_SETTINGS, isSettings).then(
      (loaded) => {
        if (active) setSettings(loaded);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const setHapticsEnabled = useCallback((hapticsEnabled: boolean) => {
    setSettings((current) => {
      const next = { ...current, hapticsEnabled };
      void saveJSON(STORAGE_KEYS.settings, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ...settings, setHapticsEnabled }),
    [settings, setHapticsEnabled],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettings must be used inside SettingsProvider');
  return context;
}
