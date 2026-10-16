import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  addHistoryEntry,
  isHistoryList,
  type HistoryEntry,
} from '@/state/history';
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/storage/storage';

type HistoryContextValue = {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  // Entries added before storage finishes loading must not be overwritten.
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;
    loadJSON(STORAGE_KEYS.history, [], isHistoryList).then((stored) => {
      if (!active) return;
      loaded.current = true;
      setEntries((current) => {
        const merged = current.reduceRight(
          (list, entry) => addHistoryEntry(list, entry),
          stored,
        );
        if (current.length > 0) void saveJSON(STORAGE_KEYS.history, merged);
        return merged;
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(
    (change: (current: HistoryEntry[]) => HistoryEntry[]) => {
      setEntries((current) => {
        const next = change(current);
        if (loaded.current) void saveJSON(STORAGE_KEYS.history, next);
        return next;
      });
    },
    [],
  );

  const addEntry = useCallback<HistoryContextValue['addEntry']>(
    ({ expression, result }) => {
      const timestamp = Date.now();
      const id = `${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
      update((current) =>
        addHistoryEntry(current, { id, expression, result, timestamp }),
      );
    },
    [update],
  );

  const clearHistory = useCallback(() => update(() => []), [update]);

  const value = useMemo(
    () => ({ entries, addEntry, clearHistory }),
    [entries, addEntry, clearHistory],
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context)
    throw new Error('useHistory must be used inside HistoryProvider');
  return context;
}
