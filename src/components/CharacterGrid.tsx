import { CharacterCard } from './CharacterCard';
import type { Kana } from '../data/kana';

interface CharacterGridProps {
  characters: Kana[];
  script:     'hiragana' | 'katakana';
  title:      string;
  symbol:     string;
}

export function CharacterGrid({ characters, script, title, symbol }: CharacterGridProps) {
  return (
    <section className="section">
      <div className="section-header">
        <span className="section-kana">{symbol}</span>
        <h2 className="section-title">{title}</h2>
        <span className="section-count">{characters.length} caractères</span>
      </div>
      <div className="kana-grid">
        {characters.map((kana, i) => (
          <CharacterCard
            key={`${kana.romanji}-${i}`}
            character={script === 'hiragana' ? kana.hiragana : kana.katakana}
            romanji={kana.romanji}
            type={kana.type}
          />
        ))}
      </div>
    </section>
  );
}
