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
    <View style={[commonStyles.marginLV, commonStyles.gapM]}>
      <Text
        style={[
          commonStyles.textMedium,
          { color: theme.text, textAlign: "center", lineHeight: 20 },
        ]}
      >
        If the dictionary is not working properly, update the dictionary locally by pressing the button below (no internet access is required)
      </Text>
      <BasicButton
        onPress={confirmUpdateDictionary}
        title="Update Dictionary"
      />
    </View>
  );
}
