import React, { useRef } from "react";
import { Text, StyleSheet, FlatList, View, SafeAreaView } from "react-native";

import AudioControlBar from "@/components/Story/AudioControlBar";
import SentenceList from "@/components/Story/SentenceList";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import PopUpDictionaryLookup from "@/components/PopUpDictionary/PopUpDictionaryLookup";

import audioControl from "@/hooks/story/audioControl";
import querySentence from "@/hooks/story/querySentence";
import lookup from "@/hooks/story/lookup";
import { Sentence } from "@/db/models";
import { commonStyles } from "@/style/commonStyles";

type Props = {
  sentences: Sentence[];
  showFurigana: boolean;
  updateData: () => void;
};

export default function SentencesWithAudioController({
  sentences,
  showFurigana,
  updateData,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const scrollToItem = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };
  const { toggleIsFavorite } = querySentence({ updateData });
  const {
    currentActive,
    isPlaying,
    isRepeat,
    playAudio,
    toggleRepeat,
    playSentence,
    playAll,
  } = audioControl({ sentences: sentences, scrollToItem });

  const { lookupWord, slideDown, onLookup, onTapWord, containerStyle } =
    lookup();

  return (
    <SafeAreaView style={commonStyles.scrollContainer}>
      <SentenceList
        flatListRef={flatListRef}
        sentences={sentences}
        isPlaying={isPlaying}
        currentActive={currentActive}
        play={playSentence}
        onTapWord={onTapWord}
        showFurigana={showFurigana}
        toggleFavorite={toggleIsFavorite}
        lookupWord={lookupWord}
      />
      <GestureDetector gesture={slideDown}>
        <Animated.View style={[containerStyle]}>
          <PopUpDictionaryLookup
            basicForm={lookupWord ? lookupWord?.basicForm : null}
            onLookup={onLookup}
          />
        </Animated.View>
      </GestureDetector>

      <AudioControlBar
        playBackward={() =>
          currentActive !== null && playAudio(currentActive - 1)
        }
        playForward={() =>
          currentActive !== null && playAudio(currentActive + 1)
        }
        playAll={playAll}
        play={() =>
          currentActive !== null ? playAudio(currentActive) : playAudio(0)
        }
        toggleRepeat={toggleRepeat}
        playBackwardDisabled={currentActive === null || currentActive === 0}
        playForwardDisabled={
          currentActive === null ||
          (sentences && currentActive + 1 === sentences.length)
        }
        isPlaying={isPlaying}
        isRepeat={isRepeat}
      />
    </SafeAreaView>
  );
}
