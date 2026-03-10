import { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { kanaData } from '../data/kana';
import { useSettings } from '../context/SettingsContext';
import { useQuiz } from '../hooks/useQuiz';
import { useTimer } from '../hooks/useTimer';
import { useStats } from '../hooks/useStats';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TimerRing } from './TimerRing';
import { QuizSummary } from './QuizSummary';
import type { Kana } from '../data/kana';

interface QuizModeProps {
  script: 'hiragana' | 'katakana';
}

export function QuizMode({ script }: QuizModeProps) {
  const { settings }                    = useSettings();
  const { recordSession, recordErrors } = useStats();
  const navigate                        = useNavigate();
  const inputRef                        = useRef<HTMLInputElement>(null);

  // ── Séance 5 : meilleur score persisté avec useLocalStorage ──
  // La clé inclut le script pour avoir un record par script
  const [bestScore, setBestScore] = useLocalStorage(`kana_best_${script}`, 0);

  const { state, dispatch, submitAnswer, reset, currentKana, answered, pct, progressPct } =
    useQuiz({ kanaData, settings, script });

  const displayChar = useMemo(() => {
    if (!currentKana) return '';
    if (settings.mode === 'inverse') return currentKana.romanji;
    return script === 'hiragana' ? currentKana.hiragana : currentKana.katakana;
  }, [currentKana, settings.mode, script]);

  const timerEnabled = settings.timerSecs !== false && settings.mode !== 'learn';
  const timer = useTimer({
    seconds:  settings.timerSecs || 10,
    enabled:  timerEnabled && !answered,
    onExpire: () => { if (!answered) submitAnswer(''); },
  });

  // Reset timer à chaque nouvelle question
  useEffect(() => {
    if (!answered) timer.reset();
  }, [state.index]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus auto sur l'input
  useEffect(() => {
    if (!answered && (settings.mode === 'type' || settings.mode === 'inverse')) {
      inputRef.current?.focus();
    }
  }, [answered, state.index, settings.mode]);

  // Sauvegarde des stats + mise à jour du record en fin de session
  useEffect(() => {
    if (!state.done) return;
    const pct = state.score.total > 0
      ? Math.round((state.score.correct / state.score.total) * 100)
      : 0;
    recordSession(state.score.correct, state.score.total, script);
    recordErrors(state.errors.map(k => ({
      char:    script === 'hiragana' ? k.hiragana : k.katakana,
      romanji: k.romanji,
    })));
    // Mise à jour du meilleur score si on fait mieux
    if (pct > bestScore) setBestScore(pct);
  }, [state.done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.done) {
    const pct = state.score.total > 0
      ? Math.round((state.score.correct / state.score.total) * 100)
      : 0;
    return (
      <QuizSummary
        score={state.score}
        errors={state.errors}
        script={script}
        bestScore={bestScore}
        isNewBest={pct >= bestScore && pct > 0}
        onRestart={reset}
        onStudy={() => navigate('/study')}
      />
    );
  }

  return (
    <div className="quiz-view">
      <div className="score-bar">
        <div>
          <div className="score-numbers">{state.score.correct}<span> / {state.score.total}</span></div>
          {state.score.total > 0 && <div className="score-pct">{pct}%</div>}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {timerEnabled && (
          <TimerRing remaining={timer.remaining} fraction={timer.fraction} colorVar={timer.colorVar} />
        )}
        {bestScore > 0 && (
          <div className="best-badge" title="Votre meilleur score">
            🏆 {bestScore}%
          </div>
        )}
        <button className="reset-btn" onClick={reset} title="Recommencer">↺</button>
      </div>

      <div className="quiz-card">
        <div className="quiz-char">{displayChar}</div>
        <div className="quiz-hint">
          {state.index + 1} / {state.pool.length}
          {' · '}
          {settings.mode === 'inverse' ? `tapez le ${script}` : 'romanisation'}
        </div>
      </div>

      {settings.mode === 'learn' && (
        <LearnInput
          kana={currentKana} script={script}
          revealed={state.learnShown} answered={answered}
          onReveal={() => dispatch({ type: 'SHOW_LEARN' })}
          onAnswer={ok => submitAnswer(ok ? currentKana.romanji : '')}
        />
      )}

      {settings.mode === 'mc' && (
        <McInput
          choices={state.mcChoices} kana={currentKana} script={script}
          answered={answered} userAns={state.userAns}
          onSelect={choice => {
            dispatch({ type: 'SET_ANS', payload: choice });
            submitAnswer(choice);
          }}
        />
      )}

      {(settings.mode === 'type' || settings.mode === 'inverse') && (
        <form onSubmit={e => { e.preventDefault(); if (state.userAns.trim()) submitAnswer(state.userAns); }}>
          <div className="quiz-form">
            <input
              ref={inputRef}
              className={`quiz-input ${state.feedback ? (state.feedback.correct ? 'correct' : 'incorrect') : ''}`}
              type="text" value={state.userAns}
              onChange={e => dispatch({ type: 'SET_ANS', payload: e.target.value })}
              placeholder={settings.mode === 'inverse' ? 'Caractère…' : 'Rōmaji…'}
              autoComplete="off" autoCorrect="off" spellCheck={false}
              disabled={answered}
            />
            <button type="submit" className="quiz-submit" disabled={answered}>Valider</button>
          </div>
        </form>
      )}

      {state.feedback && (
        <div className={`feedback ${state.feedback.correct ? 'correct-fb' : 'incorrect-fb'}`}>
          <span className="feedback-icon">{state.feedback.correct ? '✓' : '✗'}</span>
          <span>
            {state.feedback.correct
              ? 'Correct !'
              : <>Incorrect — réponse : <strong className="feedback-answer">{state.feedback.answer}</strong></>
            }
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function LearnInput({ kana, script, revealed, answered, onReveal, onAnswer }: {
  kana: Kana; script: 'hiragana' | 'katakana';
  revealed: boolean; answered: boolean;
  onReveal: () => void; onAnswer: (correct: boolean) => void;
}) {
  if (answered) return null;
  const answer = script === 'hiragana' ? kana.hiragana : kana.katakana;
  if (!revealed) {
    return (
      <button className="quiz-submit" style={{ width: '100%' }} onClick={onReveal}>
        Montrer la réponse
      </button>
    );
  }
  return (
    <>
      <div className="learn-reveal">{answer} <span className="learn-reveal-rom">({kana.romanji})</span></div>
      <div className="quiz-form">
        <button className="quiz-submit quiz-submit--correct"   onClick={() => onAnswer(true)}>✓ Je savais</button>
        <button className="quiz-submit quiz-submit--incorrect" onClick={() => onAnswer(false)}>✗ Raté</button>
      </div>
    </>
  );
}

function McInput({ choices, kana, script, answered, userAns, onSelect }: {
  choices: Kana[]; kana: Kana; script: 'hiragana' | 'katakana';
  answered: boolean; userAns: string; onSelect: (choice: string) => void;
}) {
  return (
    <div className="mc-grid">
      {choices.map(ch => {
        const isAnswer = ch.hiragana === kana.hiragana;
        const chosen   = userAns === ch.romanji;
        let cls = 'mc-btn';
        if (answered) {
          if (isAnswer)    cls += ' mc-btn--correct';
          else if (chosen) cls += ' mc-btn--incorrect';
        }
        return (
          <button key={ch.hiragana} className={cls} disabled={answered} onClick={() => onSelect(ch.romanji)}>
            <span className="mc-char">{script === 'hiragana' ? ch.hiragana : ch.katakana}</span>
            <span className="mc-rom">{ch.romanji}</span>
          </button>
        );
      })}
    </div>
  );
}
