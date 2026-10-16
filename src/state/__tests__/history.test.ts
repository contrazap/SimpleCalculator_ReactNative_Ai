import {
  addHistoryEntry,
  isHistoryList,
  MAX_HISTORY_ENTRIES,
  type HistoryEntry,
} from '@/state/history';

const entry = (n: number): HistoryEntry => ({
  id: String(n),
  expression: `${n}+0`,
  result: String(n),
  timestamp: n,
});

describe('addHistoryEntry', () => {
  it('puts the newest entry first', () => {
    expect(addHistoryEntry([entry(1)], entry(2)).map((e) => e.id)).toEqual([
      '2',
      '1',
    ]);
  });

  it(`keeps at most ${MAX_HISTORY_ENTRIES} entries, dropping the oldest`, () => {
    let entries: HistoryEntry[] = [];
    for (let n = 1; n <= MAX_HISTORY_ENTRIES + 5; n += 1) {
      entries = addHistoryEntry(entries, entry(n));
    }
    expect(entries).toHaveLength(MAX_HISTORY_ENTRIES);
    expect(entries[0].id).toBe(String(MAX_HISTORY_ENTRIES + 5));
    expect(entries.at(-1)?.id).toBe('6');
  });
});

describe('isHistoryList', () => {
  it('accepts valid lists and rejects corrupt data', () => {
    expect(isHistoryList([entry(1)])).toBe(true);
    expect(isHistoryList([])).toBe(true);
    expect(isHistoryList({})).toBe(false);
    expect(isHistoryList([{ id: 1 }])).toBe(false);
    expect(isHistoryList(null)).toBe(false);
  });
});
