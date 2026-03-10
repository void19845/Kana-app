export interface Session {
  date:    string;
  correct: number;
  total:   number;
  script:  'hiragana' | 'katakana';
}

export interface CharError {
  char:    string;
  romanji: string;
  count:   number;
}

export interface StatsStore {
  sessions:   Session[];
  charErrors: Record<string, CharError>;
}

const LS_KEY = 'kana_stats_v2';

function loadStore(): StatsStore {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? 'null') ?? { sessions: [], charErrors: {} };
  } catch {
    return { sessions: [], charErrors: {} };
  }
}

function saveStore(store: StatsStore): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch { /* quota */ }
}

export function useStats() {
  function recordSession(correct: number, total: number, script: 'hiragana' | 'katakana') {
    const store = loadStore();
    store.sessions.unshift({ date: new Date().toISOString(), correct, total, script });
    store.sessions = store.sessions.slice(0, 30);
    saveStore(store);
  }

  function recordErrors(errors: Array<{ char: string; romanji: string }>) {
    const store = loadStore();
    errors.forEach(({ char, romanji }) => {
      if (!store.charErrors[char]) store.charErrors[char] = { char, romanji, count: 0 };
      store.charErrors[char].count++;
    });
    saveStore(store);
  }

  function getStats(): StatsStore { return loadStore(); }
  function clearStats() { localStorage.removeItem(LS_KEY); }

  return { recordSession, recordErrors, getStats, clearStats };
}
