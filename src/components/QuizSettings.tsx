import { KANA_ROWS } from '../data/kana';
import { useSettings } from '../context/SettingsContext';

export type QuizMode  = 'type' | 'mc' | 'inverse' | 'learn';
export type QuizCount = number | 'all';
export type TimerSecs = 5 | 10 | 15 | 20 | false;

export interface QuizSettings {
  mode:       QuizMode;
  count:      QuizCount;
  timerSecs:  TimerSecs;
  activeRows: Set<string>;
}

const PRESETS: Record<string, string[]> = {
  voyelles: ['a'],
  basique:  ['a','ka','sa','ta','na','ha','ma','ya','ra','wa','n'],
  dakuten:  ['ga','za','da','ba'],
  tout:     KANA_ROWS.map(r => r.id),
};

function Chip({ label, active, onClick, style }: {
  label:   string;
  active:  boolean;
  onClick: () => void;
  style?:  React.CSSProperties;
}) {
  return (
    <button className={`chip ${active ? 'chip--on' : ''}`} onClick={onClick} style={style}>
      {label}
    </button>
  );
}

export function QuizSettings() {
  const { settings, dispatch } = useSettings();

  const modes: { id: QuizMode; label: string }[] = [
    { id: 'type',    label: 'Saisie' },
    { id: 'mc',      label: 'QCM' },
    { id: 'inverse', label: 'Inverse' },
    { id: 'learn',   label: 'Apprentissage' },
  ];

  const counts: QuizCount[] = [10, 20, 30, 'all'];
  const timerOpts: TimerSecs[] = [false, 5, 10, 15, 20];

  const typeColor = (t: string) =>
    t === 'dakuten' ? 'var(--blue)' : t === 'handakuten' ? 'var(--green)' : undefined;

  return (
    <aside className="quiz-sidebar">
      <div className="sb-section">
        <span className="sb-label">Mode</span>
        <div className="chip-group">
          {modes.map(m => (
            <Chip key={m.id} label={m.label} active={settings.mode === m.id}
              onClick={() => dispatch({ type: 'SET_MODE', payload: m.id })} />
          ))}
        </div>
      </div>

      <div className="sb-section">
        <span className="sb-label">Questions</span>
        <div className="chip-group">
          {counts.map(n => (
            <Chip key={String(n)} label={n === 'all' ? 'Tout' : String(n)}
              active={settings.count === n}
              onClick={() => dispatch({ type: 'SET_COUNT', payload: n })} />
          ))}
        </div>
      </div>

      {settings.mode !== 'learn' && (
        <div className="sb-section">
          <span className="sb-label">Minuterie</span>
          <div className="chip-group">
            {timerOpts.map(t => (
              <Chip key={String(t)} label={t === false ? 'Non' : `${t}s`}
                active={settings.timerSecs === t}
                onClick={() => dispatch({ type: 'SET_TIMER', payload: t })} />
            ))}
          </div>
        </div>
      )}

      <div className="sb-section">
        <span className="sb-label">Difficulté rapide</span>
        <div className="chip-group">
          {Object.keys(PRESETS).map(k => (
            <Chip key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} active={false}
              onClick={() => dispatch({ type: 'SET_PRESET', payload: new Set(PRESETS[k]) })} />
          ))}
        </div>
      </div>

      <div className="sb-section">
        <span className="sb-label">Lignes ({settings.activeRows.size}/{KANA_ROWS.length})</span>
        <div className="row-chip-grid">
          {KANA_ROWS.map(row => (
            <Chip key={row.id} label={row.label}
              active={settings.activeRows.has(row.id)}
              onClick={() => dispatch({ type: 'TOGGLE_ROW', payload: row.id })}
              style={{ color: typeColor(row.type) }} />
          ))}
        </div>
      </div>
    </aside>
  );
}
