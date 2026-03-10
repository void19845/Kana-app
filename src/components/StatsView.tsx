import { useState } from 'react';
import {useStats} from '../hooks/useStats.ts';
import type  {StatsStore} from  '../hooks/useStats.ts'
export function StatsView() {
  const { getStats, clearStats } = useStats();
  // Forcer le re-render après clear
  const [, setTick] = useState(0);
  const stats: StatsStore = getStats();

  const sessions   = stats.sessions ?? [];
  const charErrors = stats.charErrors ?? {};

  const totalQ  = sessions.reduce((a, s) => a + s.total,   0);
  const totalC  = sessions.reduce((a, s) => a + s.correct, 0);
  const avgPct  = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

  const avgColor = avgPct >= 70 ? 'var(--green)' : avgPct >= 50 ? 'var(--gold)' : 'var(--red)';

  // Caractères les plus difficiles (triés par nombre d'erreurs)
  const hardList = Object.values(charErrors)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
  const maxErr = hardList[0]?.count ?? 1;

  function handleClear() {
    if (window.confirm('Effacer toutes les statistiques ?')) {
      clearStats();
      setTick(t => t + 1);
    }
  }

  return (
    <div className="stats-view">

      {/* Résumé global */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-card-title">Sessions</h3>
          <div className="stat-big">{sessions.length}</div>
          <div className="stat-label">parties jouées</div>
        </div>

        <div className="stat-card">
          <h3 className="stat-card-title">Taux de réussite</h3>
          <div className="stat-big" style={{ color: avgColor }}>{avgPct}%</div>
          <div className="stat-label">{totalC} / {totalQ} bonnes réponses</div>
        </div>
      </div>

      {/* Historique */}
      <div className="stat-card stat-card--full">
        <h3 className="stat-card-title">Historique des sessions</h3>
        {sessions.length === 0
          ? <p className="no-data">Aucune session enregistrée.</p>
          : (
            <ul className="sessions-list">
              {sessions.map((s, i) => {
                const pct  = Math.round((s.correct / s.total) * 100);
                const date = new Date(s.date).toLocaleString('fr-FR', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                });
                return (
                  <li key={i} className="session-row">
                    <span className="session-date">{date}</span>
                    <span className="session-script">
                      {s.script === 'hiragana' ? 'ひ' : 'カ'}
                    </span>
                    <span className="session-score">
                      {s.correct}<span className="session-total"> / {s.total}</span>
                    </span>
                    <span className="session-pct">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          )
        }
      </div>

      {/* Caractères difficiles */}
      <div className="stat-card stat-card--full">
        <h3 className="stat-card-title">Caractères difficiles</h3>
        {hardList.length === 0
          ? <p className="no-data">Aucune erreur enregistrée.</p>
          : (
            <div className="hard-grid">
              {hardList.map(c => (
                <div key={c.char} className="hard-item">
                  <span className="hard-char">{c.char}</span>
                  <span className="hard-rom">{c.romanji}</span>
                  <span className="hard-count">{c.count}×</span>
                  <div className="hard-bar">
                    <div className="hard-fill"
                      style={{ width: `${Math.round((c.count / maxErr) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )
        }
        {sessions.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            Effacer les statistiques
          </button>
        )}
      </div>

    </div>
  );
}
