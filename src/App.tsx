
import { useState }                    from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

type Script = 'hiragana' | 'katakana';

export default function App() {
  const [script, setScript]           = useState<Script>('hiragana');
  const location                      = useLocation();
  const navigate                      = useNavigate();

  const isQuiz   = location.pathname.startsWith('/quiz');
  const isStats  = location.pathname.startsWith('/stats');
  const isKatakana = script === 'katakana';

  function handleScriptToggle() {
    const next = isKatakana ? 'hiragana' : 'katakana';
    setScript(next);
    // Synchronise l'URL : /study/hiragana, /quiz/katakana, etc.
    if (isQuiz)  navigate(`/quiz/${next}`);
    else         navigate(`/study/${next}`);
  }

  return (
      <>
        {/* ── Header ── */}
        <header className="app-header">
          <div className="logo">
            <span className="logo-kana">仮名</span>
            <span className="logo-text">Kana Master</span>
          </div>

          {/* NavLink : classe active ajoutée automatiquement par React Router */}
          <nav className="mode-tabs">
            <NavLink
                to="/study"
                className={({ isActive }) => `mode-tab ${isActive ? 'mode-tab--active' : ''}`}
            >
              Étude
            </NavLink>
            <NavLink
                to="/quiz"
                className={({ isActive }) => `mode-tab ${isActive ? 'mode-tab--active' : ''}`}
            >
              Quiz
            </NavLink>
            <NavLink
                to="/stats"
                className={({ isActive }) => `mode-tab ${isActive ? 'mode-tab--active' : ''}`}
            >
              Stats
            </NavLink>
          </nav>

          {/* Toggle script (masqué sur /stats) */}
          {!isStats && (
              <div className="script-toggle">
            <span className={`script-label ${!isKatakana ? 'script-label--active' : ''}`}>
              Hiragana
            </span>
                <button
                    className={`toggle-pill ${isKatakana ? 'toggle-pill--on' : ''}`}
                    onClick={handleScriptToggle}
                    title="Changer de script"
                />
                <span className={`script-label ${isKatakana ? 'script-label--active' : ''}`}>
              Katakana
            </span>
              </div>
          )}
        </header>

        {/* ── Outlet : page injectée par React Router ── */}
        <main>
          <Outlet />
        </main>
      </>
  );
}