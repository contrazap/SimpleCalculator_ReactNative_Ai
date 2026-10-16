export const MAX_HISTORY_ENTRIES = 100;

export type HistoryEntry = {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
};

/** Newest first; the oldest entries are dropped beyond the cap. */
export function addHistoryEntry(
  entries: readonly HistoryEntry[],
  entry: HistoryEntry,
  max: number = MAX_HISTORY_ENTRIES,
): HistoryEntry[] {
  return [entry, ...entries].slice(0, max);
}

export function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.expression === 'string' &&
    typeof entry.result === 'string' &&
    typeof entry.timestamp === 'number'
  );
}

export function isHistoryList(value: unknown): value is HistoryEntry[] {
  return Array.isArray(value) && value.every(isHistoryEntry);
}
