import { Text, StyleProp, TextStyle, StyleSheet } from "react-native";
import { TagIndex } from "@/db/models";
import { useTheme } from "@/style/ThemeProvider";
import { commonStyles } from "@/style/commonStyles";

type Props = {
  tags: string[];
  style?: StyleProp<TextStyle>;
};

export function TagList({ tags, style }: Props) {
  const { theme } = useTheme();

  return (
    <>
      {tags.map((pos, j) => {
        return (
          <Text
            key={j}
            style={[
              commonStyles.tags,
              { backgroundColor: theme.purple, color: "white" },
              style,
            ]}
          >
            {pos}
          </Text>
        );
      })}
    </>
  );
}

export function JmdictTagList({ tags, style }: Props) {
  return <TagList style={style} tags={tags.map((pos) => TagIndex[pos])} />;
}
