import { View } from "react-native";
import { JMdictWord, TagIndex } from "@/db/models";
import { NoteBox, NoteChildren } from "../common/NoteBox";

type Props = {
  entry: JMdictWord;
};

export default function OtherForms({ entry }: Props) {
  if (entry.kana.length <= 1 && entry.kanji.length <= 1) {
    return;
  }

  let forms: string[] = [];
  let notes: string[] = [];

  entry.kana.forEach((kana, i) => {
    entry.kanji.forEach((kanji, j) => {
      if (i === 0 && j === 0) {
        return;
      }
      if (
        kana.appliesToKanji.includes("*") ||
        kana.appliesToKanji.includes(kanji.text)
      ) {
        forms.push(`${kanji.text}(${kana.text})`);
      }
    });
    if (
      (entry.kanji.length === 0 && i !== 0) ||
      kana.appliesToKanji.length === 0
    ) {
      forms.push(kana.text);
    }
  });

  entry.kanji.forEach((kanji, i) => {
    if (kanji.tags.length > 0) {
      notes.push(
        `${kanji.text}: (${kanji.tags.map((tag) => TagIndex[tag]).join("; ")})`
      );
    }
  });

  entry.kana.forEach((kana, i) => {
    if (kana.tags.length > 0) {
      notes.push(
        `${kana.text}: (${kana.tags.map((tag) => TagIndex[tag]).join("; ")})`
      );
    }
  });

  return (
    (forms.length > 0 || notes.length > 0) && (
      <View>
        {forms.length > 0 && (
          <NoteBox title={"Forms"}>
            <NoteChildren list={[forms.join("; ")]} />
          </NoteBox>
        )}
        {notes.length > 0 && (
          <NoteBox title={"Notes"}>
            <NoteChildren list={[notes.join("; ")]} />
          </NoteBox>
        )}
      </View>
    )
  );
}
