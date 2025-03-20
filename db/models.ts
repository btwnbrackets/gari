export interface Story {
  id: number;
  name: string;
  creationDate: string;
  readDate: string;
}

export interface SentenceRaw {
  id: number;
  content: string;
  audioUri: string;
  storyId: number;
  tokens: string;
  isFavorite: number;
}


export interface Sentence {
  id: number;
  content: string;
  audioUri: string;
  storyId: number;
  tokens: Token[];
  isFavorite: boolean;
}

export interface Token {
  surfaceForm: string;
  basicForm: string;
  reading: string;
  wordPosition: number;
}

export interface StoryDetails {
  story: Story;
  sentences: Sentence[];
}

export interface GroupedByHistory {
  [key: string]: Story[];
}


export interface LookedupWord {
  basicForm: string;
  isFavorite: boolean;
  count: number;
  modifiedDate: string;
}

export interface LookedupWordTokens {
  basicForm: string;
  wordPosition: number;
  sentenceId: number;
  modifiedDate: string;
}

export interface Dictionary {
  id: number;
  data: JMdictWord;
  jlpt: number;
  isCommon: number
}

export interface DictionaryIndex {
  word: string;
  dicId: number;
}

export interface LookedupJoin {
  basicForm: string;
  isFavorite: number;
  count: number;
  modifiedDate: string;

  wordPosition: number;
  tokenModifiedDate: string;
  sentenceId: number;
  tokens: string,

  dicId: number;
  data: string;
  jlpt: number;
  isCommon: number;
}

export interface GroupedLookedup {
  basicForm: {
    basicForm: string;
    isFavorite: boolean;
    count: number;
    modifiedDate: string;
  };
  tokenSentences: {
    wordPosition: number;
    tokenModifiedDate: string;
    sentenceId: number;
    tokens: Token[];
  }[];
  dictionary: Dictionary[];
}

export interface Tag {
  name: string;
  id: number;
}

export interface KUROMOJI_TOKEN {
  word_id: number;
  word_type: "KNOWN" | "UNKNOWN" | "BOS" | "EOS";
  word_position: number;
  surface_form: string | Uint8Array;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading?: string;
  pronunciation?: string;
}

//////////////////
//    JMdict    //
//////////////////

/**
 * xref - Full reference format: word (kanji+kana) + reading (kana-only) + sense index (starting from 1)
 */
export type XrefWordReadingIndex = [
  kanji: string,
  kana: string,
  senseIndex: number
];

/**
 * xref - Shorter reference format: word + reading, without sense index
 */
export type XrefWordReading = [kanji: string, kana: string];

/**
 * xref - Shorter reference format: word (can be kana-only or contain kanji) + sense index
 */
export type XrefWordIndex = [kanjiOrKana: string, senseIndex: number];

/**
 * xref - The shortest reference format: just the word (can be kana-only or contain kanji)
 */
export type XrefWord = [kanjiOrKana: string];

/**
 * xref - Cross-reference
 *
 * Examples:
 * - `["丸", "まる", 1]` - refers to the word "丸", read as "まる" ("maru"),
 *   specifically the 1st sense element
 * - `["○", "まる", 1]` - same as previous, but "○" is a special character
 *    for the word "丸"
 * - `["二重丸", "にじゅうまる"]` - refers to the word "二重丸",
 *   read as "にじゅうまる" ("nijoumaru")
 * - `["漢数字"]` - refers to the word "漢数字", with any reading
 */
export type Xref =
  | XrefWordReadingIndex
  | XrefWordReading
  | XrefWordIndex
  | XrefWord;

/**
 * tag - All tags are listed in a separate section of the file.
 * See the descriptions of the root JSON objects of each dictionary.
 *
 * Examples:
 * - `"v5uru"` - "Godan verb - Uru old class verb (old form of Eru)"
 * - `"n"` - "noun (common) (futsuumeishi)",
 * - `"tv"` - "television"
 */

export type JMdictTag = string;

/**
 * JMdict entry/word
 */
export type JMdictWord = {
  /**
   * Unique identifier of an entry
   */
  id: string;

  /**
   * Kanji (and other non-kana) writings.
   * Note that some words are only spelled with kana, so this may be empty.
   */
  kanji: JMdictKanji[];

  /**
   * Kana-only writings of words.
   * If a kanji is also present, these can be considered as "readings",
   * but there are words written with kana only.
   */
  kana: JMdictKana[];

  /**
   * Senses = translations + some related data
   */
  sense: JMdictSense[];
};

export type JMdictKanji = {
  /**
   * `true` if this particular word is considered common.
   * This field combines all the `*_pri` fields
   * from original files in a same way as <https://jisho.org>
   * and other on-line dictionaries do (typically, some words have
   * "common" markers/tags). It gets rid of a bunch of `*_pri` fields
   * which are not typically used. Words marked with "news1", "ichi1",
   * "spec1", "spec2", "gai1" in the original file are treated as common,
   * which may or may not be true according to other sources.
   */
  common: boolean;

  /**
   * The word itself, as spelled with any non-kana-only writing.
   * May contain kanji, kana (but not only kana!), and some other characters.
   * Example: "ＣＤプレイヤー" - none of these symbols are kanji,
   * but "ＣＤ" is not kana, so it will be in this field. The corresponding
   * kana text will be "シーディープレイヤー", where "シーディー" is how the "ＣＤ"
   * is spelled in Japanese kana.
   */
  text: string;

  /**
   * Tags applicable to this writing
   */
  tags: JMdictTag[];
};

export type JMdictKana = {
  /**
   * Same as {@link JMdictKanji}.common.
   * In this case, it shows that this particular kana transcription of a word
   * is considered common. For example, when a word can be read in multiple ways,
   * some of them may be more common than others.
   */
  common: boolean;

  /**
   * Kana-only writing, may only accidentally contain middle-dot
   * and other punctuation-like characters.
   */
  text: string;

  /**
   * Same as {@link JMdictKanji}.tags
   */
  tags: JMdictTag[];

  /**
   * List of kanji spellings of this word which this particular kana version applies to.
   * `"*"` means "all", an empty array means "none".
   * This field is useful for words will multiple kanji variants - some of them may be read
   * differently than others.
   */
  appliesToKanji: string[];
};

export type JMdictSense = {
  /**
   * Parts of speech for this sense.
   *
   * In the original files, part-of-speech from the previous sense elements
   * may apply to the subsequent elements: e.g. if the 1st and 2nd elements
   * are both nouns, then only the 1st will state that explicitly.
   * This requires users to check the whole list of senses to correctly
   * determine part of speech for any particular sense.
   *
   * Unlike the original XML files, this field is never empty/missing.
   * Here, this field is "normalized" - parts of speech are present
   * in every element, even if they are all the same.
   */
  partOfSpeech: JMdictTag[];

  /**
   * List of kanji writings within this word which this sense applies to.
   * Works in conjunction with the next `appliesToKana` field.
   * `"*"` means "all". This is never empty, unlike {@link JMdictKana}.appliesToKanji.
   */
  appliesToKanji: string[];

  /**
   * List of kana writings within this word which this sense applies to.
   * Works in conjunction with the previous `appliesToKanji` field.
   * "*" means "all". This is never empty, unlike {@link JMdictKana}.appliesToKanji.
   */
  appliesToKana: string[];

  /**
   * References to related words
   */
  related: Xref[];

  /**
   * References to antonyms of this word
   */
  antonym: Xref[];

  /**
   * List of fields of application of this word.
   * E.g. `"math"` means that this word is related to or used in Mathematics.
   */
  field: JMdictTag[];

  /**
   * List of dialects where this word is used
   */
  dialect: JMdictTag[];

  /**
   * Miscellanea - list of other tags which don't fit into other tag fields
   */
  misc: JMdictTag[];

  /**
   * Other information about this word
   */
  info: string[];

  /**
   * Source language information for borrowed words and wasei-eigo.
   * Will be empty for words with Japanese origin (most of JMdict entries)
   */
  languageSource: JMdictLanguageSource[];

  /**
   * Translations of this word
   */
  gloss: JMdictGloss[];
};

/**
 * Source language information for borrowed words and wasei-eigo.
 * For borrowed words this will contain the original word/phrase,
 * in the source language
 */
export type JMdictLanguageSource = {
  /**
   * Language of this translation
   */
  lang: "eng";

  /**
   * Indicates whether the sense element fully or partially
   * describes the source word or phrase of the loanword
   */
  full: boolean;

  /**
   * Indicates that the word is wasei-eigo.
   *
   * @see <https://en.wikipedia.org/wiki/Wasei-eigo>
   */
  wasei: boolean;

  /**
   * Text in the language defined by a `lang` field, or `null`
   */
  text: string | null;
};

/**
 * Gender
 */
export type JMdictGender = "masculine" | "feminine" | "neuter";

/**
 * export type of translation
 */
export type JMdictGlossType =
  | "literal"
  | "figurative"
  | "explanation"
  | "trademark"; // e.g. name of a company or a product

/**
 * Translation of a word
 */
export type JMdictGloss = {
  /**
   * Language of this translation
   */
  lang: "eng";

  /**
   * Gender.
   * Typically, for a noun in the target language.
   * When `null`, the gender is either not relevant or hasn't been provided.
   */
  gender: JMdictGender | null;

  /**
   * export type of translation.
   * Most words have `null` values, meaning this attribute was absent in the original XML entry.
   * Jmdict documentation does not describe the meaning of this attribute being absent.
   */
  type: JMdictGlossType | null;

  /**
   * A translation word/phrase
   */
  text: string;
};

export const TagIndex: { [key: string]: string } = {
  v5uru: "Godan verb - Uru old class verb (old form of Eru)",
  "v2g-s": "Nidan verb (lower class) with 'gu' ending (archaic)",
  dei: "deity",
  ship: "ship name",
  leg: "legend",
  bra: "Brazilian",
  music: "music",
  quote: "quotation",
  pref: "prefix",
  ktb: "Kantou-ben",
  rK: "rarely used kanji form",
  derog: "derogatory",
  abbr: "abbreviation",
  exp: "expressions (phrases, clauses, etc.)",
  astron: "astronomy",
  "v2g-k": "Nidan verb (upper class) with 'gu' ending (archaic)",
  "aux-v": "auxiliary verb",
  ctr: "counter",
  surg: "surgery",
  baseb: "baseball",
  serv: "service",
  genet: "genetics",
  geogr: "geography",
  dent: "dentistry",
  "v5k-s": "Godan verb - Iku/Yuku special class",
  horse: "horse racing",
  ornith: "ornithology",
  "v2w-s":
    "Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)",
  sK: "search-only kanji form",
  rk: "rarely used kana form",
  hob: "Hokkaido-ben",
  male: "male term or language",
  motor: "motorsport",
  vidg: "video games",
  "n-pref": "noun, used as a prefix",
  "n-suf": "noun, used as a suffix",
  suf: "suffix",
  hon: "honorific or respectful (sonkeigo) language",
  biol: "biology",
  pol: "polite (teineigo) language",
  vulg: "vulgar expression or word",
  "v2n-s": "Nidan verb (lower class) with 'nu' ending (archaic)",
  mil: "military",
  golf: "golf",
  min: "mineralogy",
  X: "rude or X-rated term (not displayed in educational software)",
  sk: "search-only kana form",
  jpmyth: "Japanese mythology",
  sl: "slang",
  fict: "fiction",
  art: "art, aesthetics",
  stat: "statistics",
  cryst: "crystallography",
  pathol: "pathology",
  photo: "photography",
  food: "food, cooking",
  n: "noun (common) (futsuumeishi)",
  thb: "Touhoku-ben",
  fish: "fishing",
  "v5r-i": "Godan verb with 'ru' ending (irregular verb)",
  arch: "archaic",
  v1: "Ichidan verb",
  bus: "business",
  tv: "television",
  euph: "euphemistic",
  embryo: "embryology",
  "v2y-k": "Nidan verb (upper class) with 'yu' ending (archaic)",
  uk: "word usually written using kana alone",
  rare: "rare term",
  "v2a-s": "Nidan verb with 'u' ending (archaic)",
  hanaf: "hanafuda",
  figskt: "figure skating",
  agric: "agriculture",
  given: "given name or forename, gender not specified",
  physiol: "physiology",
  "v5u-s": "Godan verb with 'u' ending (special class)",
  chn: "children's language",
  ev: "event",
  adv: "adverb (fukushi)",
  prt: "particle",
  vi: "intransitive verb",
  "v2y-s": "Nidan verb (lower class) with 'yu' ending (archaic)",
  kyb: "Kyoto-ben",
  vk: "Kuru verb - special class",
  grmyth: "Greek mythology",
  vn: "irregular nu verb",
  electr: "electronics",
  gardn: "gardening, horticulture",
  "adj-kari": "'kari' adjective (archaic)",
  vr: "irregular ru verb, plain form ends with -ri",
  vs: "noun or participle which takes the aux. verb suru",
  internet: "Internet",
  vt: "transitive verb",
  cards: "card games",
  stockm: "stock market",
  vz: "Ichidan verb - zuru verb (alternative form of -jiru verbs)",
  aux: "auxiliary",
  "v2h-s": "Nidan verb (lower class) with 'hu/fu' ending (archaic)",
  kyu: "Kyuushuu-ben",
  noh: "noh",
  econ: "economics",
  rommyth: "Roman mythology",
  ecol: "ecology",
  "n-t": "noun (temporal) (jisoumeishi)",
  psy: "psychiatry",
  proverb: "proverb",
  company: "company name",
  poet: "poetical term",
  ateji: "ateji (phonetic) reading",
  paleo: "paleontology",
  "v2h-k": "Nidan verb (upper class) with 'hu/fu' ending (archaic)",
  civeng: "civil engineering",
  go: "go (game)",
  "adv-to": "adverb taking the 'to' particle",
  ent: "entomology",
  unc: "unclassified",
  unclass: "unclassified name",
  "on-mim": "onomatopoeic or mimetic word",
  yoji: "yojijukugo",
  "n-adv": "adverbial noun (fukushitekimeishi)",
  print: "printing",
  form: "formal or literary term",
  obj: "object",
  osb: "Osaka-ben",
  "adj-shiku": "'shiku' adjective (archaic)",
  Christn: "Christianity",
  hum: "humble (kenjougo) language",
  obs: "obsolete term",
  relig: "religion",
  iK: "word containing irregular kanji usage",
  "v2k-s": "Nidan verb (lower class) with 'ku' ending (archaic)",
  conj: "conjunction",
  "v2s-s": "Nidan verb (lower class) with 'su' ending (archaic)",
  geol: "geology",
  geom: "geometry",
  anat: "anatomy",
  nab: "Nagano-ben",
  ski: "skiing",
  hist: "historical term",
  fam: "familiar language",
  myth: "mythology",
  gramm: "grammar",
  "v2k-k": "Nidan verb (upper class) with 'ku' ending (archaic)",
  id: "idiomatic expression",
  v5aru: "Godan verb - -aru special class",
  psyanal: "psychoanalysis",
  comp: "computing",
  creat: "creature",
  ik: "word containing irregular kana usage",
  oth: "other",
  "v-unspec": "verb unspecified",
  io: "irregular okurigana usage",
  work: "work of art, literature, music, etc. name",
  "adj-ix": "adjective (keiyoushi) - yoi/ii class",
  phil: "philosophy",
  doc: "document",
  math: "mathematics",
  pharm: "pharmacology",
  "adj-nari": "archaic/formal form of na-adjective",
  "v2r-k": "Nidan verb (upper class) with 'ru' ending (archaic)",
  "adj-f": "noun or verb acting prenominally",
  "adj-i": "adjective (keiyoushi)",
  audvid: "audiovisual",
  rkb: "Ryuukyuu-ben",
  "adj-t": "'taru' adjective",
  "v2r-s": "Nidan verb (lower class) with 'ru' ending (archaic)",
  Buddh: "Buddhism",
  biochem: "biochemistry",
  "v2b-k": "Nidan verb (upper class) with 'bu' ending (archaic)",
  "vs-s": "suru verb - special class",
  surname: "family or surname",
  physics: "physics",
  place: "place name",
  "v2b-s": "Nidan verb (lower class) with 'bu' ending (archaic)",
  kabuki: "kabuki",
  prowres: "professional wrestling",
  product: "product name",
  "vs-c": "su verb - precursor to the modern suru",
  tsug: "Tsugaru-ben",
  "adj-ku": "'ku' adjective (archaic)",
  telec: "telecommunications",
  "vs-i": "suru verb - included",
  "v2z-s": "Nidan verb (lower class) with 'zu' ending (archaic)",
  organization: "organization name",
  char: "character",
  engr: "engineering",
  logic: "logic",
  "v2m-s": "Nidan verb (lower class) with 'mu' ending (archaic)",
  col: "colloquial",
  archeol: "archeology",
  cop: "copula",
  num: "numeric",
  aviat: "aviation",
  "aux-adj": "auxiliary adjective",
  "m-sl": "manga slang",
  fem: "female term or language",
  MA: "martial arts",
  finc: "finance",
  "v1-s": "Ichidan verb - kureru special class",
  "v2m-k": "Nidan verb (upper class) with 'mu' ending (archaic)",
  manga: "manga",
  shogi: "shogi",
  group: "group",
  "adj-no": "nouns which may take the genitive case particle 'no'",
  "adj-na": "adjectival nouns or quasi-adjectives (keiyodoshi)",
  sens: "sensitive",
  law: "law",
  vet: "veterinary terms",
  mahj: "mahjong",
  v4b: "Yodan verb with 'bu' ending (archaic)",
  rail: "railway",
  v4g: "Yodan verb with 'gu' ending (archaic)",
  elec: "electricity, elec. eng.",
  film: "film",
  mining: "mining",
  v4h: "Yodan verb with 'hu/fu' ending (archaic)",
  v4k: "Yodan verb with 'ku' ending (archaic)",
  v4m: "Yodan verb with 'mu' ending (archaic)",
  v4n: "Yodan verb with 'nu' ending (archaic)",
  sumo: "sumo",
  v4s: "Yodan verb with 'su' ending (archaic)",
  v4r: "Yodan verb with 'ru' ending (archaic)",
  person: "full name of a particular person",
  v4t: "Yodan verb with 'tsu' ending (archaic)",
  boxing: "boxing",
  oK: "word containing out-dated kanji or kanji usage",
  cloth: "clothing",
  joc: "jocular, humorous term",
  politics: "politics",
  "v2t-k": "Nidan verb (upper class) with 'tsu' ending (archaic)",
  tsb: "Tosa-ben",
  v5b: "Godan verb with 'bu' ending",
  ling: "linguistics",
  bot: "botany",
  "v2t-s": "Nidan verb (lower class) with 'tsu' ending (archaic)",
  v5g: "Godan verb with 'gu' ending",
  med: "medicine",
  v5k: "Godan verb with 'ku' ending",
  mech: "mechanical engineering",
  v5n: "Godan verb with 'nu' ending",
  v5m: "Godan verb with 'mu' ending",
  "v2d-k": "Nidan verb (upper class) with 'dzu' ending (archaic)",
  v5r: "Godan verb with 'ru' ending",
  v5t: "Godan verb with 'tsu' ending",
  v5s: "Godan verb with 'su' ending",
  v5u: "Godan verb with 'u' ending",
  Shinto: "Shinto",
  station: "railway station",
  chmyth: "Chinese mythology",
  dated: "dated term",
  "v2d-s": "Nidan verb (lower class) with 'dzu' ending (archaic)",
  psych: "psychology",
  "adj-pn": "pre-noun adjectival (rentaishi)",
  ok: "out-dated or obsolete kana usage",
  met: "meteorology",
  chem: "chemistry",
  sports: "sports",
  zool: "zoology",
  int: "interjection (kandoushi)",
  tradem: "trademark",
  "net-sl": "Internet slang",
  "n-pr": "proper noun",
  archit: "architecture",
  ksb: "Kansai-ben",
  pn: "pronoun",
  gikun: "gikun (meaning as reading) or jukujikun (special kanji reading)",
};
