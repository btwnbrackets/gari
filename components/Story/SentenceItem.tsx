import React from "react";
import TapIcon from "@/components/common/TapIcon";
import { Pressable, StyleSheet, Text } from "react-native";
import { Sentence, Token } from "@/db/models";
import TokenItem from "./TokenItem";
import {
  LongPressGestureHandler,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { spacing } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  sentence: Sentence;
  play: () => void;
  toggleFavorite: () => void;
  isPause: boolean;
  isActive: boolean;
  showFurigana: boolean;
  onTapWord: (token: Token, sentenceId: number, wordPosition: number) => void;
  lookupWord: {
    basicForm: string;
    sentenceId: number;
    wordPosition: number;
  } | null;
};

export default function SentenceItem({
  sentence,
  play,
  isPause,
  isActive,
  onTapWord,
  lookupWord,
  showFurigana,
  toggleFavorite,
}: Props) {
  const { theme } = useTheme();

  return (
    <LongPressGestureHandler onActivated={toggleFavorite}>
      <TapGestureHandler onActivated={play} waitFor={toggleFavorite}>
        <Text style={styles.container}>
          <TapIcon
            style={styles.playIcon}
            onTap={play}
            iconName={isPause ? "pause-circle" : "play-circle"}
            color={isActive ? theme.accent : theme.text}
          />
          <TapIcon
            style={styles.playIcon}
            onTap={toggleFavorite}
            iconName={sentence.isFavorite ? "star" : "star-outline"}
            color={isActive ? theme.accent : theme.text}
          />
          <Text style={styles.sentenceContainer}>
            {sentence.tokens.map((token, i) => (
              <TokenItem
                showFurigana={showFurigana}
                key={i}
                token={token}
                onTapWord={() =>
                  onTapWord(token, sentence.id, token.wordPosition)
                }
                isTapped={
                  sentence.id === lookupWord?.sentenceId &&
                  token.wordPosition === lookupWord?.wordPosition
                }
                enableTap={true}
                style={{ color: isActive ? theme.accent : theme.text }}
              />
            ))}
          </Text>
        </Text>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
}

const styles = StyleSheet.create({
  playIcon: {
    padding: spacing.small,
    paddingStart: 0,
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  sentenceContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
  },
});
