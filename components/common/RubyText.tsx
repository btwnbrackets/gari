import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
} from "react-native";

interface Props {
  base: string;
  furigana: string;
  furiganaStyle?: StyleProp<TextStyle>;
  baseStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function RubyText({
  base,
  furigana,
  baseStyle,
  furiganaStyle,
  containerStyle,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={furiganaStyle}>{base !== furigana && furigana}</Text>
      <Text style={baseStyle}>{base}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
