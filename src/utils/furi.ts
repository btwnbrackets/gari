function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60)
  );
}

function isHiragana(char: string): boolean {
  return /[\u3040-\u309F]/.test(char);
}

interface Token {
  text: string;
  isHiragana: boolean;
}

function tokenizeKanji(kanji: string): Token[] {
  const tokens: Token[] = [];
  let buffer = "";
  let currentIsHira: boolean | null = null;

  for (const char of kanji) {
    const charIsHira = isHiragana(char);
    if (currentIsHira === null) {
      currentIsHira = charIsHira;
      buffer = char;
    } else if (charIsHira === currentIsHira) {
      if (charIsHira) {
        tokens.push({ text: buffer, isHiragana: currentIsHira });
        buffer = char;
      } else {
        buffer += char;
      }
    } else {
      tokens.push({ text: buffer, isHiragana: currentIsHira });
      buffer = char;
      currentIsHira = charIsHira;
    }
  }
  if (buffer) {
    tokens.push({ text: buffer, isHiragana: currentIsHira as boolean });
  }
  return tokens;
}

export interface FuriganaToken {
  token: string;
  reading: string;
}

export function furigana(kanjiStr: string, readingStr: string): FuriganaToken[] {
  // this function takes the expression and reading, 
  // and return a list of tokens and their correspondign reading
  // covers a wide varitey of use cases
  // I made it with kuromoji reading in mind, 
  // so I convert the readingStr from katakana to hiragana

  if(kanjiStr === readingStr || readingStr === "") {
    return [{ token: kanjiStr, reading: "" }]
  }
  const normKanji = kanjiStr.trim();
  const normReading = katakanaToHiragana(readingStr.trim());

  const tokens = tokenizeKanji(normKanji);
  const result: FuriganaToken[] = [];
  let rIndex = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tokenObj = tokens[i];

    if (tokenObj.isHiragana) {
      if (rIndex < normReading.length) {
        result.push({ token: tokenObj.text, reading: normReading[rIndex] });
        rIndex++;
      } else {
        result.push({ token: tokenObj.text, reading: "" });
      }
    } else {
      if (
        i < tokens.length - 1 &&
        tokens[i + 1].isHiragana &&
        rIndex < normReading.length &&
        normReading[rIndex] === tokens[i + 1].text
      ) {
        result.push({ token: tokenObj.text, reading: normReading[rIndex] });
        rIndex++;
        continue;
      }
      if (i < tokens.length - 1 && tokens[i + 1].isHiragana && rIndex < normReading.length) {
        const nextHira = tokens[i + 1].text;
        const pos = normReading.indexOf(nextHira, rIndex);
        if (pos !== -1 && pos > rIndex) {
          result.push({
            token: tokenObj.text,
            reading: normReading.substring(rIndex, pos),
          });
          rIndex = pos;
          continue;
        } else {
          result.push({
            token: tokenObj.text,
            reading: normReading.substring(rIndex),
          });
          rIndex = normReading.length;
          continue;
        }
      } else {
        result.push({
          token: tokenObj.text,
          reading: normReading.substring(rIndex),
        });
        rIndex = normReading.length;
      }
    }
  }
  return result;
}

