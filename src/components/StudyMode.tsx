import { useMemo } from 'react';
import { kanaData } from '../data/kana';
import { useSettings } from '../context/SettingsContext';
import { CharacterGrid } from './CharacterGrid';

interface StudyModeProps {
  script: 'hiragana' | 'katakana';
}

export function StudyMode({ script }: StudyModeProps) {
  const { settings } = useSettings();

  const visibleKana = useMemo(
    () => kanaData.filter(k => settings.activeRows.has(k.row)),
    [settings.activeRows]
  );

  const { symbol, title } = useMemo(() => ({
    symbol: script === 'hiragana' ? 'ひ' : 'カ',
    title:  script === 'hiragana' ? 'Hiragana' : 'Katakana',
  }), [script]);

  return (
    <div className="study-view">
      <CharacterGrid characters={visibleKana} script={script} title={title} symbol={symbol} />
      <div className="legend">
        <div className="legend-item"><div className="legend-dot base" />Caractères de base</div>
        <div className="legend-item"><div className="legend-dot dakuten" />Dakuten ゛</div>
        <div className="legend-item"><div className="legend-dot handakuten" />Handakuten ゜</div>
      </div>
    </div>
  );
}
