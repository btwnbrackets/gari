import SwipableCard from "@/components/common/SwipableCard";
import PopUpDictionaryEntry from "@/components/PopUpDictionary/PopUpDictionaryEntry";
import { GroupedLookedup } from "@/db/models";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import SentenceItem from "./SentenceItem";
import { useState } from "react";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TapIcon from "../common/TapIcon";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  item: GroupedLookedup;
  showFurigana: boolean;
  onDelete: (basicForm: string, callback: () => void) => void;
  toggleIsFavorite: (basicForm: string) => void;
};

export default function LookupItem({
  item,
  onDelete,
  toggleIsFavorite,
  showFurigana,
}: Props) {
  const { theme } = useTheme();

  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const collapsableStyle = useAnimatedStyle(() => {
    animatedHeight.value = expanded ? withTiming(height) : withTiming(0);

    return {
      height: animatedHeight.value,
    };
  }, [expanded]);

  return (
    <SwipableCard
      onDelete={(callback) => {
        onDelete(item.basicForm.basicForm, callback);
      }}
      enableEdit={false}
      onClick={toggleExpand}
      onLongPress={() => {
        console.log("add to favorite!");
        toggleIsFavorite(item.basicForm.basicForm);
      }}
    >
      <View style={styles.itemHeaderContainer}>
        <View style={[styles.basicFormContainer, commonStyles.gapM]}>          
          <Text style={[commonStyles.textBXL, { color: theme.text }]}>{item.basicForm.basicForm}</Text>
          <Text style={[commonStyles.textSmall, { color: theme.gray }]}>
            Looked up times: {item.basicForm.count}
          </Text>
        </View>
        <View>
          <TapIcon
            onTap={() => toggleIsFavorite(item.basicForm.basicForm)}
            iconName={item.basicForm.isFavorite ? "star" : "star-outline"}
            size={24}
            color={item.basicForm.isFavorite ? theme.accent : theme.background}
          />
          <TapIcon
            onTap={toggleExpand}
            iconName={
              expanded ? "arrow-up-drop-circle" : "arrow-down-drop-circle"
            }
            size={24}
          />
        </View>
      </View>

      <Reanimated.View style={[collapsableStyle]}>
        <View style={{ position: "absolute" }} onLayout={onLayout}>
          <View>
            <Text style={[commonStyles.textBM, commonStyles.marginMV, { color: theme.text }]}>Sentences</Text>
            {item.tokenSentences.map((sentence, j) => {
              return (
                <SentenceItem
                  sentence={sentence}
                  showFurigana={showFurigana}
                  key={j}
                />
              );
            })}
          </View>

          <View>
          <Text style={[commonStyles.textBM, commonStyles.marginMV, { color: theme.text }]}>Definition</Text>
            {item.dictionary.map((entry, j) => {
              return (
                <PopUpDictionaryEntry
                  entry={entry}
                  isLast={j + 1 == item.dictionary?.length}
                  key={j}
                />
              );
            })}
          </View>
        </View>
      </Reanimated.View>
    </SwipableCard>
  );
}

const styles = StyleSheet.create({
  itemHeaderContainer: {
    flexDirection: "row",
  },
  basicFormContainer: {
    flex: 1,
  },
});
