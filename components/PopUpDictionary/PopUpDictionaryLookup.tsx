import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Dictionary } from "@/db/models";
import { lookupWord } from "@/db/queries";
import PopUpDictionaryEntry from "./PopUpDictionaryEntry";
import {
  FlatList,
} from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import { spacing, ThemeType } from "@/style/theme";
import { useTheme } from "@/style/ThemeProvider";

const { height } = Dimensions.get("window"); 

type Props = {
  basicForm: string | null;
  onLookup: (isFound: boolean) => void;
};

export default function PopUpDictionaryLookup({ basicForm, onLookup }: Props) {
  const [information, setInformation] = useState<Dictionary[] | null>([]);
  const { theme } = useTheme();

  const styles = componentStyles(theme);
  const loadLookup = async () => {
    if (basicForm) {
      try {
        const data = await lookupWord(basicForm);
        setInformation(data);
        onLookup(data.length > 0);
      } catch (error) {
        console.error("Error lookingup word:", error);
        onLookup(false);
      }
    } else {
      onLookup(false);
    }
  };

  useEffect(() => {
    loadLookup();
  }, [basicForm]);

  return (
    <View style={[styles.helpBox]}>
      {information && information?.length > 0 && (
        <>
          <Text style={styles.text}>Lookup word: {basicForm}</Text>
          <FlatList
            contentContainerStyle={commonStyles.flatList}
            data={information}
            keyExtractor={(item) => item.data.id}
            renderItem={({ item, index }) => (
              <PopUpDictionaryEntry entry={item} isLast={(index + 1) == information.length} />
            )}
          />
        </>
      )}
    </View>
  );
}

const componentStyles = (theme: ThemeType) => StyleSheet.create({
  helpBox: {
    padding: 8,
    paddingBottom: 0,
    marginBottom: 0,
    backgroundColor: theme.border,
    borderTopStartRadius: spacing.large,
    borderTopEndRadius: spacing.large,
    height: height * 0.6,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  text: {
    padding: spacing.large,
    ...commonStyles.normalText,
    color: theme.text
  },
});
