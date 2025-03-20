import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { JMdictSense, TagIndex } from "@/db/models";
import { PropsWithChildren } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BOX_ALPHA, ThemeType } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";

type Props = PropsWithChildren<{
  title: string;
  style?: "yellowBox" | "blueBox" | "redBox";
}>;

type NoteChildrenProps = {
  list: string[];
};

export function NoteBox({ title, children, style }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.note, style && styles(theme)[style]]}>
      <Text style={styles(theme).boxTitle}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

export function NoteChildren({ list }: NoteChildrenProps) {
  const { theme } = useTheme();

  return list.map((item, i) => {
    return (
      <View style={styles(theme).noteItem} key={i}>
        {list.length > 1 && (
          <MaterialCommunityIcons name="circle" style={styles(theme).dot} />
        )}
        <Text key={i} style={styles(theme).text}>
          {item}
        </Text>
      </View>
    );
  });
}

const styles = (theme: ThemeType) =>
  StyleSheet.create({
    text: {
      color: theme.text,
      textOverflow: "wrap",
    },
    yellowBox: {
      backgroundColor: theme.yellow + BOX_ALPHA,
      borderLeftColor: theme.yellow,
    },
    blueBox: {
      backgroundColor: theme.blue + BOX_ALPHA,
      borderLeftColor: theme.blue,
    },
    redBox: {
      backgroundColor: theme.red + BOX_ALPHA,
      borderLeftColor: theme.red,
    },
    boxTitle: {
      fontWeight: "bold",
      color: theme.text,
    },
    noteItem: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    dot: {
      margin: 4,
      color: theme.text,
    },
  });
