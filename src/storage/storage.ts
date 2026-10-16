import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  history: 'simplecalc/history/v1',
  settings: 'simplecalc/settings/v1',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Reads and validates a JSON value. Missing, unreadable or corrupt data falls
 * back to the default: losing history is better than crashing on launch.
 */
export async function loadJSON<T>(
  key: StorageKey,
  fallback: T,
  isValid: (value: unknown) => value is T,
): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key: StorageKey, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is best effort; the in-memory state stays correct.
  }
}
