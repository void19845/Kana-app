/**
 * Séance 4 — NOUVEAU
 * SettingsContext : partage les settings du quiz dans tout l'arbre
 * sans prop drilling App → QuizLayout → QuizSettings → QuizMode.
 *
 * Concepts utilisés :
 *   - createContext / useContext
 *   - useReducer  (remplace les useState éparpillés dans S3)
 */

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { KANA_ROWS } from '../data/kana.ts';
import type { QuizSettings } from '../src/components/QuizSettings';

// ─── État initial ─────────────────────────────────────────────────────────────

const initialSettings: QuizSettings = {
  mode:       'type',
  count:      20,
  timerSecs:  10,
  activeRows: new Set(KANA_ROWS.map(r => r.id)),
};

// ─── Actions du reducer ───────────────────────────────────────────────────────

type SettingsAction =
  | { type: 'SET_MODE';       payload: QuizSettings['mode'] }
  | { type: 'SET_COUNT';      payload: QuizSettings['count'] }
  | { type: 'SET_TIMER';      payload: QuizSettings['timerSecs'] }
  | { type: 'TOGGLE_ROW';     payload: string }               // id de la ligne
  | { type: 'SET_PRESET';     payload: Set<string> }          // activeRows précalculées
  | { type: 'RESET' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function settingsReducer(state: QuizSettings, action: SettingsAction): QuizSettings {
  switch (action.type) {

    case 'SET_MODE':
      // Désactive le timer automatiquement en mode apprentissage
      return {
        ...state,
        mode:      action.payload,
        timerSecs: action.payload === 'learn' ? false : state.timerSecs,
      };

    case 'SET_COUNT':
      return { ...state, count: action.payload };

    case 'SET_TIMER':
      return { ...state, timerSecs: action.payload };

    case 'TOGGLE_ROW': {
      const next = new Set(state.activeRows);
      // Empêche de désélectionner la dernière ligne
      if (next.has(action.payload) && next.size > 1) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, activeRows: next };
    }

    case 'SET_PRESET':
      return { ...state, activeRows: action.payload };

    case 'RESET':
      return initialSettings;

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface SettingsContextValue {
  settings: QuizSettings;
  dispatch: React.Dispatch<SettingsAction>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

// ─── Hook consommateur ────────────────────────────────────────────────────────

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings doit être utilisé dans un <SettingsProvider>');
  return ctx;
}
