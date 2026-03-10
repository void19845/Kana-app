import type { Kana } from '../data/kana';

interface Score { correct: number; total: number; }

interface QuizSummaryProps {
  score:     Score;
  errors:    Kana[];
  script:    'hiragana' | 'katakana';
  bestScore: number;   // meilleur score historique (%)
  isNewBest: boolean;  // vrai si cette session bat le record
  onRestart: () => void;
  onStudy:   () => void;
}

export function QuizSummary({ score, errors, script, bestScore, isNewBest, onRestart, onStudy }: QuizSummaryProps) {
  const pct   = Math.round((score.correct / score.total) * 100);
  const grade = pct >= 90 ? '優' : pct >= 70 ? '良' : pct >= 50 ? '可' : '不';
  const label = pct >= 90 ? 'Excellent !' : pct >= 70 ? 'Bien joué.' : pct >= 50 ? 'Continuez !' : 'À réviser…';
  const uniqueErrors = [...new Map(errors.map(e => [e.hiragana, e])).values()];

  return (
    <div className="summary-overlay">
      <div className="summary-box">
        <div className="summary-grade">{grade}</div>
        <h2 className="summary-title">Session terminée</h2>
        <div className="summary-score">{pct}%</div>
        <p className="summary-sub">{score.correct} bonnes réponses sur {score.total} questions</p>
        <p className="summary-label">{label}</p>

        {/* ── Meilleur score ── */}
        <div className="summary-best">
          {isNewBest
            ? <span className="summary-best--new">🏆 Nouveau record !</span>
            : <span className="summary-best--prev">Record : {bestScore}%</span>
          }
        </div>

        {uniqueErrors.length > 0 && (
          <div className="summary-errors">
            <p className="summary-errors-title">À revoir ({uniqueErrors.length})</p>
            <div className="summary-errors-grid">
              {uniqueErrors.map(k => (
                <div key={k.hiragana} className="summary-error-item">
                  <span className="summary-error-char">
                    {script === 'hiragana' ? k.hiragana : k.katakana}
                  </span>
                  <span className="summary-error-rom">{k.romanji}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="summary-actions">
          <button className="summary-btn summary-btn--primary" onClick={onRestart}>Recommencer</button>
          <button className="summary-btn summary-btn--ghost" onClick={onStudy}>Réviser la table</button>
        </div>
      </div>
    </div>
  );
}
