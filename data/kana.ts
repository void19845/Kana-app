// ─── Types ────────────────────────────────────────────────────────────────────

export interface Kana {
  hiragana: string;
  katakana: string;
  romanji:  string;
  row:      string;
  type:     'base' | 'dakuten' | 'handakuten';
  alt?:     string[]; // romanisations alternatives acceptées (ex: shi → si)
}

export interface KanaRow {
  id:    string;
  label: string; // caractère représentatif affiché
  type:  'base' | 'dakuten' | 'handakuten';
}

// ─── Liste des lignes (gojūon) ─────────────────────────────────────────────

export const KANA_ROWS: KanaRow[] = [
  { id: 'a',  label: 'あ', type: 'base' },
  { id: 'ka', label: 'か', type: 'base' },
  { id: 'sa', label: 'さ', type: 'base' },
  { id: 'ta', label: 'た', type: 'base' },
  { id: 'na', label: 'な', type: 'base' },
  { id: 'ha', label: 'は', type: 'base' },
  { id: 'ma', label: 'ま', type: 'base' },
  { id: 'ya', label: 'や', type: 'base' },
  { id: 'ra', label: 'ら', type: 'base' },
  { id: 'wa', label: 'わ', type: 'base' },
  { id: 'n',  label: 'ん', type: 'base' },
  { id: 'ga', label: 'が', type: 'dakuten' },
  { id: 'za', label: 'ざ', type: 'dakuten' },
  { id: 'da', label: 'だ', type: 'dakuten' },
  { id: 'ba', label: 'ば', type: 'dakuten' },
  { id: 'pa', label: 'ぱ', type: 'handakuten' },
];

// ─── Données complètes ────────────────────────────────────────────────────────

export const kanaData: Kana[] = [
  // Ligne a
  { hiragana: 'あ', katakana: 'ア', romanji: 'a',   row: 'a',  type: 'base' },
  { hiragana: 'い', katakana: 'イ', romanji: 'i',   row: 'a',  type: 'base' },
  { hiragana: 'う', katakana: 'ウ', romanji: 'u',   row: 'a',  type: 'base' },
  { hiragana: 'え', katakana: 'エ', romanji: 'e',   row: 'a',  type: 'base' },
  { hiragana: 'お', katakana: 'オ', romanji: 'o',   row: 'a',  type: 'base' },
  // Ligne ka
  { hiragana: 'か', katakana: 'カ', romanji: 'ka',  row: 'ka', type: 'base' },
  { hiragana: 'き', katakana: 'キ', romanji: 'ki',  row: 'ka', type: 'base' },
  { hiragana: 'く', katakana: 'ク', romanji: 'ku',  row: 'ka', type: 'base' },
  { hiragana: 'け', katakana: 'ケ', romanji: 'ke',  row: 'ka', type: 'base' },
  { hiragana: 'こ', katakana: 'コ', romanji: 'ko',  row: 'ka', type: 'base' },
  // Ligne sa
  { hiragana: 'さ', katakana: 'サ', romanji: 'sa',  row: 'sa', type: 'base' },
  { hiragana: 'し', katakana: 'シ', romanji: 'shi', row: 'sa', type: 'base', alt: ['si'] },
  { hiragana: 'す', katakana: 'ス', romanji: 'su',  row: 'sa', type: 'base' },
  { hiragana: 'せ', katakana: 'セ', romanji: 'se',  row: 'sa', type: 'base' },
  { hiragana: 'そ', katakana: 'ソ', romanji: 'so',  row: 'sa', type: 'base' },
  // Ligne ta
  { hiragana: 'た', katakana: 'タ', romanji: 'ta',  row: 'ta', type: 'base' },
  { hiragana: 'ち', katakana: 'チ', romanji: 'chi', row: 'ta', type: 'base', alt: ['ti'] },
  { hiragana: 'つ', katakana: 'ツ', romanji: 'tsu', row: 'ta', type: 'base', alt: ['tu'] },
  { hiragana: 'て', katakana: 'テ', romanji: 'te',  row: 'ta', type: 'base' },
  { hiragana: 'と', katakana: 'ト', romanji: 'to',  row: 'ta', type: 'base' },
  // Ligne na
  { hiragana: 'な', katakana: 'ナ', romanji: 'na',  row: 'na', type: 'base' },
  { hiragana: 'に', katakana: 'ニ', romanji: 'ni',  row: 'na', type: 'base' },
  { hiragana: 'ぬ', katakana: 'ヌ', romanji: 'nu',  row: 'na', type: 'base' },
  { hiragana: 'ね', katakana: 'ネ', romanji: 'ne',  row: 'na', type: 'base' },
  { hiragana: 'の', katakana: 'ノ', romanji: 'no',  row: 'na', type: 'base' },
  // Ligne ha
  { hiragana: 'は', katakana: 'ハ', romanji: 'ha',  row: 'ha', type: 'base' },
  { hiragana: 'ひ', katakana: 'ヒ', romanji: 'hi',  row: 'ha', type: 'base' },
  { hiragana: 'ふ', katakana: 'フ', romanji: 'fu',  row: 'ha', type: 'base', alt: ['hu'] },
  { hiragana: 'へ', katakana: 'ヘ', romanji: 'he',  row: 'ha', type: 'base' },
  { hiragana: 'ほ', katakana: 'ホ', romanji: 'ho',  row: 'ha', type: 'base' },
  // Ligne ma
  { hiragana: 'ま', katakana: 'マ', romanji: 'ma',  row: 'ma', type: 'base' },
  { hiragana: 'み', katakana: 'ミ', romanji: 'mi',  row: 'ma', type: 'base' },
  { hiragana: 'む', katakana: 'ム', romanji: 'mu',  row: 'ma', type: 'base' },
  { hiragana: 'め', katakana: 'メ', romanji: 'me',  row: 'ma', type: 'base' },
  { hiragana: 'も', katakana: 'モ', romanji: 'mo',  row: 'ma', type: 'base' },
  // Ligne ya
  { hiragana: 'や', katakana: 'ヤ', romanji: 'ya',  row: 'ya', type: 'base' },
  { hiragana: 'ゆ', katakana: 'ユ', romanji: 'yu',  row: 'ya', type: 'base' },
  { hiragana: 'よ', katakana: 'ヨ', romanji: 'yo',  row: 'ya', type: 'base' },
  // Ligne ra
  { hiragana: 'ら', katakana: 'ラ', romanji: 'ra',  row: 'ra', type: 'base' },
  { hiragana: 'り', katakana: 'リ', romanji: 'ri',  row: 'ra', type: 'base' },
  { hiragana: 'る', katakana: 'ル', romanji: 'ru',  row: 'ra', type: 'base' },
  { hiragana: 'れ', katakana: 'レ', romanji: 're',  row: 'ra', type: 'base' },
  { hiragana: 'ろ', katakana: 'ロ', romanji: 'ro',  row: 'ra', type: 'base' },
  // Ligne wa
  { hiragana: 'わ', katakana: 'ワ', romanji: 'wa',  row: 'wa', type: 'base' },
  { hiragana: 'を', katakana: 'ヲ', romanji: 'wo',  row: 'wa', type: 'base' },
  // n
  { hiragana: 'ん', katakana: 'ン', romanji: 'n',   row: 'n',  type: 'base' },
  // Dakuten
  { hiragana: 'が', katakana: 'ガ', romanji: 'ga',  row: 'ga', type: 'dakuten' },
  { hiragana: 'ぎ', katakana: 'ギ', romanji: 'gi',  row: 'ga', type: 'dakuten' },
  { hiragana: 'ぐ', katakana: 'グ', romanji: 'gu',  row: 'ga', type: 'dakuten' },
  { hiragana: 'げ', katakana: 'ゲ', romanji: 'ge',  row: 'ga', type: 'dakuten' },
  { hiragana: 'ご', katakana: 'ゴ', romanji: 'go',  row: 'ga', type: 'dakuten' },
  { hiragana: 'ざ', katakana: 'ザ', romanji: 'za',  row: 'za', type: 'dakuten' },
  { hiragana: 'じ', katakana: 'ジ', romanji: 'ji',  row: 'za', type: 'dakuten', alt: ['zi'] },
  { hiragana: 'ず', katakana: 'ズ', romanji: 'zu',  row: 'za', type: 'dakuten' },
  { hiragana: 'ぜ', katakana: 'ゼ', romanji: 'ze',  row: 'za', type: 'dakuten' },
  { hiragana: 'ぞ', katakana: 'ゾ', romanji: 'zo',  row: 'za', type: 'dakuten' },
  { hiragana: 'だ', katakana: 'ダ', romanji: 'da',  row: 'da', type: 'dakuten' },
  { hiragana: 'ぢ', katakana: 'ヂ', romanji: 'ji',  row: 'da', type: 'dakuten' },
  { hiragana: 'づ', katakana: 'ヅ', romanji: 'zu',  row: 'da', type: 'dakuten' },
  { hiragana: 'で', katakana: 'デ', romanji: 'de',  row: 'da', type: 'dakuten' },
  { hiragana: 'ど', katakana: 'ド', romanji: 'do',  row: 'da', type: 'dakuten' },
  { hiragana: 'ば', katakana: 'バ', romanji: 'ba',  row: 'ba', type: 'dakuten' },
  { hiragana: 'び', katakana: 'ビ', romanji: 'bi',  row: 'ba', type: 'dakuten' },
  { hiragana: 'ぶ', katakana: 'ブ', romanji: 'bu',  row: 'ba', type: 'dakuten' },
  { hiragana: 'べ', katakana: 'ベ', romanji: 'be',  row: 'ba', type: 'dakuten' },
  { hiragana: 'ぼ', katakana: 'ボ', romanji: 'bo',  row: 'ba', type: 'dakuten' },
  // Handakuten
  { hiragana: 'ぱ', katakana: 'パ', romanji: 'pa',  row: 'pa', type: 'handakuten' },
  { hiragana: 'ぴ', katakana: 'ピ', romanji: 'pi',  row: 'pa', type: 'handakuten' },
  { hiragana: 'ぷ', katakana: 'プ', romanji: 'pu',  row: 'pa', type: 'handakuten' },
  { hiragana: 'ぺ', katakana: 'ペ', romanji: 'pe',  row: 'pa', type: 'handakuten' },
  { hiragana: 'ぽ', katakana: 'ポ', romanji: 'po',  row: 'pa', type: 'handakuten' },
];