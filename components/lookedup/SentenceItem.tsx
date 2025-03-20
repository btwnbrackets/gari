import TokenItem from "@/components/Story/TokenItem";
import { Token } from "@/db/models";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

type Props = {
  sentence: {
    wordPosition: number;
    tokenModifiedDate: string;
    sentenceId: number;
    tokens: Token[];
  };
  showFurigana: boolean;
};

export default function SentenceItem({ sentence, showFurigana }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.sentenceContainer}>
      <View style={styles.dot}>
        <MaterialCommunityIcons name="circle" color={theme.secondary} />
      </View>
      {sentence.tokens.map((token) => {
        return (
          <TokenItem
            showFurigana={showFurigana}
            key={token.wordPosition}
            token={token}
            entryContainer={styles.entryContainer}
            furiganaStyle={{ color: theme.primary }}
            style={[
              token.wordPosition == sentence.wordPosition
                ? { color: theme.primary, fontWeight: "bold" }
                : { color: theme.text },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sentenceContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  dot: {
    marginBottom: 8,
    marginRight: 8,
  },
  entryContainer: {
    paddingVertical: 0,
  },
});
