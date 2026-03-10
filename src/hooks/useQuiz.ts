import { useReducer, useCallback } from 'react';
import type { Kana } from '../data/kana';
import type { QuizSettings } from '../components/QuizSettings';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildPool(all: Kana[], settings: QuizSettings): Kana[] {
  const filtered = all.filter(k => settings.activeRows.has(k.row));
  const base     = filtered.length > 0 ? filtered : all;
  const shuffled = shuffleArray(base);
  return settings.count === 'all' ? shuffled : shuffled.slice(0, settings.count);
}

export function makeMcChoices(kana: Kana, all: Kana[]): Kana[] {
  const others = all.filter(k => k.hiragana !== kana.hiragana);
  return shuffleArray([kana, ...shuffleArray(others).slice(0, 3)]);
}

export function isCorrectAnswer(
  ans:    string,
  kana:   Kana,
  mode:   QuizSettings['mode'],
  script: 'hiragana' | 'katakana'
): boolean {
  if (mode === 'inverse') {
    return ans.trim() === (script === 'hiragana' ? kana.hiragana : kana.katakana);
  }
  const a = ans.toLowerCase().trim();
  return a === kana.romanji.toLowerCase()
    || (kana.alt ?? []).map(x => x.toLowerCase()).includes(a);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Feedback {
  correct: boolean;
  answer:  string;
}

export interface QuizState {
  pool:       Kana[];
  index:      number;
  userAns:    string;
  feedback:   Feedback | null;
  score:      { correct: number; total: number };
  errors:     Kana[];
  done:       boolean;
  mcChoices:  Kana[];
  learnShown: boolean;
}

type QuizAction =
  | { type: 'RESET';   payload: { pool: Kana[]; mcChoices: Kana[] } }
  | { type: 'SET_ANS'; payload: string }
  | { type: 'SUBMIT';  payload: { correct: boolean; answer: string } }
  | { type: 'ADVANCE'; payload: { nextMcChoices: Kana[] } }
  | { type: 'DONE' }
  | { type: 'SHOW_LEARN' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'RESET':
      return {
        pool:       action.payload.pool,
        index:      0,
        userAns:    '',
        feedback:   null,
        score:      { correct: 0, total: 0 },
        errors:     [],
        done:       false,
        mcChoices:  action.payload.mcChoices,
        learnShown: false,
      };
    case 'SET_ANS':
      return { ...state, userAns: action.payload };
    case 'SUBMIT': {
      const { correct, answer } = action.payload;
      return {
        ...state,
        userAns:  '',
        feedback: { correct, answer },
        score: {
          correct: state.score.correct + (correct ? 1 : 0),
          total:   state.score.total + 1,
        },
        errors: correct ? state.errors : [...state.errors, state.pool[state.index]],
      };
    }
    case 'ADVANCE':
      return {
        ...state,
        index:      state.index + 1,
        feedback:   null,
        userAns:    '',
        learnShown: false,
        mcChoices:  action.payload.nextMcChoices,
      };
    case 'DONE':
      return { ...state, done: true };
    case 'SHOW_LEARN':
      return { ...state, learnShown: true };
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseQuizOptions {
  kanaData: Kana[];
  settings: QuizSettings;
  script:   'hiragana' | 'katakana';
}

export function useQuiz({ kanaData, settings, script }: UseQuizOptions) {
  const initialPool      = buildPool(kanaData, settings);
  const initialMcChoices = settings.mode === 'mc'
    ? makeMcChoices(initialPool[0], kanaData)
    : [];

  const [state, dispatch] = useReducer(quizReducer, {
    pool:       initialPool,
    index:      0,
    userAns:    '',
    feedback:   null,
    score:      { correct: 0, total: 0 },
    errors:     [],
    done:       false,
    mcChoices:  initialMcChoices,
    learnShown: false,
  });

  const submitAnswer = useCallback((ans: string) => {
    if (state.feedback) return;
    const kana    = state.pool[state.index];
    const correct = isCorrectAnswer(ans, kana, settings.mode, script);
    const goodAns = settings.mode === 'inverse'
      ? (script === 'hiragana' ? kana.hiragana : kana.katakana)
      : kana.romanji;

    dispatch({ type: 'SUBMIT', payload: { correct, answer: goodAns } });

    setTimeout(() => {
      if (state.index + 1 >= state.pool.length) {
        dispatch({ type: 'DONE' });
      } else {
        const next = state.pool[state.index + 1];
        dispatch({
          type:    'ADVANCE',
          payload: { nextMcChoices: settings.mode === 'mc' ? makeMcChoices(next, kanaData) : [] },
        });
      }
    }, 1400);
  }, [state.feedback, state.pool, state.index, settings.mode, script, kanaData]);

  const reset = useCallback(() => {
    const pool      = buildPool(kanaData, settings);
    const mcChoices = settings.mode === 'mc' ? makeMcChoices(pool[0], kanaData) : [];
    dispatch({ type: 'RESET', payload: { pool, mcChoices } });
  }, [kanaData, settings]);

  return {
    state,
    dispatch,
    submitAnswer,
    reset,
    currentKana: state.pool[state.index],
    answered:    state.feedback !== null,
    pct:         state.score.total > 0
                   ? Math.round((state.score.correct / state.score.total) * 100)
                   : 0,
    progressPct: Math.round((state.index / state.pool.length) * 100),
  };
}
