// ─── Types ────────────────────────────────────────────────────────────────────

export interface Session {
  date:    string; // ISO
  correct: number;
  total:   number;
  script:  'hiragana' | 'katakana';
}

export interface CharError {
  char:  string; // le caractère affiché (h ou k selon script)
  romanji: string;
  count: number;
}

export interface StatsStore {
  sessions:   Session[];
  charErrors: Record<string, CharError>; // clé = caractère
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

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
  /** Enregistre une session terminée. */
  function recordSession(correct: number, total: number, script: 'hiragana' | 'katakana') {
    const store = loadStore();
    store.sessions.unshift({ date: new Date().toISOString(), correct, total, script });
    store.sessions = store.sessions.slice(0, 30); // garder max 30
    saveStore(store);
  }

  /** Enregistre les caractères qui ont été ratés. */
  function recordErrors(errors: Array<{ char: string; romanji: string }>) {
    const store = loadStore();
    errors.forEach(({ char, romanji }) => {
      if (!store.charErrors[char]) {
        store.charErrors[char] = { char, romanji, count: 0 };
      }
      store.charErrors[char].count++;
    });
    saveStore(store);
  }

  /** Lit le store actuel (lecture seule). */
  function getStats(): StatsStore {
    return loadStore();
  }

  /** Efface toutes les données. */
  function clearStats() {
    localStorage.removeItem(LS_KEY);
  }

  return { recordSession, recordErrors, getStats, clearStats };
}
