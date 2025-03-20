import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Token } from "@/db/models";
import { furigana } from "@/src/utils/furi";
import RubyText from "../common/RubyText";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";

type Props = {
  token: Token;
  onTapWord?: () => void;
  style?: StyleProp<TextStyle>;
  furiganaStyle?: StyleProp<TextStyle>;
  entryContainer?: StyleProp<ViewStyle>;
  showFurigana?: boolean;
  enableTap?: boolean;
  isTapped?: boolean;
};

export default function TokenItem({
  token,
  onTapWord = () => {},
  style,
  showFurigana,
  enableTap,
  furiganaStyle,
  entryContainer,
  isTapped = false,
}: Props) {
  const { theme } = useTheme();

  const parts = furigana(
    token.surfaceForm,
    token.reading && token.reading ? token.reading : token.surfaceForm
  );
  return (
    <Text
      disabled={!enableTap}
      onPress={() => {
        onTapWord();
      }}
    >
      {parts.map((part, i) => {
        // console.log(part)
        return (
          <RubyText
            key={i}
            base={part.token}
            furigana={part.reading}
            baseStyle={[
              commonStyles.base,
              style,
              enableTap &&
                isTapped && {
                  color: theme.secondary,
                },
            ]}
            furiganaStyle={[
              commonStyles.furigana,
              {
                color: showFurigana ? theme.primary : "transparent",
              },
              furiganaStyle,
            ]}
            containerStyle={[commonStyles.padSV, entryContainer]}
          />
        );
      })}
    </Text>
  );
}
