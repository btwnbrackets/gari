import BasicButton from "@/components/common/BasicButton";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { Text, View } from "react-native";

type Props = {
  confirmUpdateDictionary: () => void;
};

export default function DatabaseUpdate({ confirmUpdateDictionary }: Props) {
  const { theme } = useTheme();

  return (
    <View style={commonStyles.gapM}>
      <Text
        style={[
          commonStyles.textMedium,
          { color: theme.text, textAlign: "center", lineHeight: 30 },
        ]}
      >
        To update dictionary data, press the button below.
      </Text>
      <BasicButton
        onPress={confirmUpdateDictionary}
        title="update dictionary!"
      />
    </View>
  );
}
