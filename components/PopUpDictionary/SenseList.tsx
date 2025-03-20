import { View, Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import { JMdictSense } from "@/db/models";
import { JmdictTagList } from "../common/Tag";
import React from "react";
import { NoteBox, NoteChildren } from "../common/NoteBox";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";

type Props = {
  senses: JMdictSense[];
};

type ApplesToProps = {
  list: string[];
  style?: StyleProp<TextStyle>;
};

function AppliesTo({ list, style }: ApplesToProps) {
  if (list[0] === "*") {
    return;
  }
  const { theme } = useTheme();

  return (
    <View style={commonStyles.note}>
      <Text style={{ color: theme.text }}>
        Applies only to {list.filter((x) => x != "*").join("; ")}
      </Text>
    </View>
  );
}

export default function SenseList({ senses }: Props) {
  const { theme } = useTheme();

  return (
    <View>
      {senses.map((sense, i) => {
        return (
          <View key={i}>
            <View style={styles.gloss}>
              <Text style={[styles.text, { color: theme.text }]}>
                {i + 1}.{" "}
              </Text>
              {sense.gloss
                .map((x) => x.text)
                .join("; ")
                .split(/(\s+)/)
                .map((word, j) => {
                  return (
                    <Text key={j} style={[styles.text, { color: theme.text }]}>
                      {word}
                    </Text>
                  );
                })}
              <JmdictTagList
                tags={sense.partOfSpeech}
                style={{ backgroundColor: theme.lightGray }}
              />
              <JmdictTagList tags={sense.field} />
              <JmdictTagList tags={sense.dialect} />
              <JmdictTagList tags={sense.misc} />
            </View>

            <View>
              <AppliesTo list={sense.appliesToKanji} />
              <AppliesTo list={sense.appliesToKana} />

              {sense.info.length > 0 && (
                <NoteBox title={"Note"} style={"yellowBox"}>
                  <NoteChildren list={sense.info} />
                </NoteBox>
              )}

              {sense.related.length > 0 && (
                <NoteBox title={"Related"} style={"blueBox"}>
                  <NoteChildren
                    list={sense.related.map((item) => {
                      return typeof item[1] != "string"
                        ? item[0]
                        : `${item[0]}(${item[1]})`;
                    })}
                  />
                </NoteBox>
              )}

              {sense.antonym.length > 0 && (
                <NoteBox title={"Antonym"} style={"redBox"}>
                  <NoteChildren
                    list={sense.antonym.map((item) => {
                      return typeof item[1] != "string"
                        ? item[0]
                        : `${item[0]}(${item[1]})`;
                    })}
                  />
                </NoteBox>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gloss: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
  },
  text: {
    textOverflow: "wrap",
  },
});
