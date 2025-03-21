import { View, Text, StyleSheet } from "react-native";
import { Dictionary } from "@/db/models";
import SenseList from "./SenseList";
import OtherForms from "./OtherForms";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { RubyBlock, furigana } from "@btwnbrackets/react-native-furi";

type Props = {
  entry: Dictionary;
  isLast: boolean;
};

// kana/kanji tags
export default function PopUpDictionaryEntry({ entry, isLast }: Props) {
  if (entry.data.kana.length === 0 && entry.data.kanji.length === 0) {
    return;
  }
  const { theme } = useTheme();

  return (
    <View
      style={[
        commonStyles.padMV,
        !isLast && [
          styles.divider,
          {
            borderColor: theme.lightGray,
          },
        ],
      ]}
    >
      <View>
        <View style={styles.entryTitle}>
          {entry.data.kanji.length > 0 ? (
            furigana(entry.data.kanji[0].text, entry.data.kana[0].text).map(
              (part, i) => {
                return (
                  <RubyBlock
                    key={i}
                    base={part.token}
                    furigana={part.reading}
                    baseStyle={[
                      styles.base,
                      {
                        color: theme.text,
                      },
                    ]}
                    furiganaStyle={[
                      styles.furigana,
                      {
                        color: theme.primary,
                      },
                    ]}
                  />
                );
              }
            )
          ) : (
            <Text style={styles.base}>{entry.data.kana[0].text}</Text>
          )}
        </View>

        <View style={[styles.commonContainer, commonStyles.marginMV]}>
          {entry.isCommon > 0 && (
            <Text
              style={[
                commonStyles.tags,
                { backgroundColor: theme.green, color: "white" },
              ]}
            >
              Common Word
            </Text>
          )}
          {entry.jlpt > 0 && (
            <Text
              style={[
                commonStyles.tags,
                { backgroundColor: theme.green, color: "white" },
              ]}
            >
              JLPT N{entry.jlpt}
            </Text>
          )}
        </View>
      </View>
      <View>
        <SenseList senses={entry.data.sense} />
        <OtherForms entry={entry.data} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
  },
  entryTitle: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },
  commonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  furigana: {
    fontSize: 20,
  },
  base: {
    fontSize: 40,
  },
});
