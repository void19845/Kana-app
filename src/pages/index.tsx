import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyMode }    from '../components/StudyMode';
import { QuizMode }     from '../components/QuizMode';
import { QuizSettings } from '../components/QuizSettings';
import { StatsView }    from '../components/StatsView';

// ─── Page Étude ───────────────────────────────────────────────────────────────

export function StudyPage() {
  const { script = 'hiragana' } = useParams<{ script?: string }>();
  const s = script === 'katakana' ? 'katakana' : 'hiragana';
  return <StudyMode script={s} />;
}

// ─── Page Quiz ────────────────────────────────────────────────────────────────

export function QuizPage() {
  const { script = 'hiragana' } = useParams<{ script?: string }>();
  const s = script === 'katakana' ? 'katakana' : 'hiragana';
  const [quizKey, setQuizKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="quiz-layout">
      <QuizSettings />
      <QuizMode key={`${quizKey}-${s}`} script={s} />
      {/* Bouton relancer caché — utilisé programmatiquement */}
      <button style={{ display: 'none' }}
        onClick={() => { setQuizKey(k => k + 1); navigate(`/quiz/${s}`); }}>
        ↺
      </button>
    </div>
  );
}

// ─── Page Stats ───────────────────────────────────────────────────────────────

export function StatsPage() {
  return <StatsView />;
}
