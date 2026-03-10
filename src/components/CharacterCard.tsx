interface CharacterCardProps {
  character: string;
  romanji:   string;
  type?:     'base' | 'dakuten' | 'handakuten';
}

export function CharacterCard({ character, romanji, type = 'base' }: CharacterCardProps) {
  return (
    <div className={`kana-card kana-card--${type}`} title={romanji}>
      <span className="kana-char">{character}</span>
      <span className="kana-romaji">{romanji}</span>
    </div>
  );
}
