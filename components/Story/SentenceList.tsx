import React from "react";
import { StyleSheet, View } from "react-native";
import { Sentence, Token } from "@/db/models";
import SentenceItem from "./SentenceItem";
import { FlatList } from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  sentences: Sentence[];
  play: (index: number) => void;
  isPlaying: boolean;
  showFurigana: boolean;
  currentActive: number | null;
  flatListRef: any;
  toggleFavorite: (id: number) => void;
  onTapWord: (token: Token, sentenceId: number, wordPosition: number) => void;
  lookupWord: {
    basicForm: string;
    sentenceId: number;
    wordPosition: number;
  } | null;
};

export default function SentenceList({
  sentences,
  play,
  isPlaying,
  currentActive,
  flatListRef,
  showFurigana,
  onTapWord,
  lookupWord,
  toggleFavorite,
}: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        commonStyles.scrollContainer,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <FlatList
        contentContainerStyle={commonStyles.flatList}
        ref={flatListRef}
        data={sentences}
        keyExtractor={(item) => item.audioUri}
        renderItem={({ item, index }) => (
          <SentenceItem
            toggleFavorite={() => toggleFavorite(item.id)}
            onTapWord={onTapWord}
            lookupWord={lookupWord}
            sentence={item}
            play={() => play(index)}
            isPause={index === currentActive && isPlaying}
            isActive={index === currentActive}
            showFurigana={showFurigana}
          />
        )}
      />
    </View>
  );
}
