import BasicButton from "@/components/common/BasicButton";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { updateDictionary } from "@/db/database";
import queryUpdateDictionary from "@/hooks/info/queryUpdateDictionary";
import { commonStyles } from "@/style/commonStyles";
import { useTheme } from "@/style/ThemeProvider";
import { Text, Linking, View } from "react-native";

type Props = {
  string: string;
  link?: string;
};

function HrefWebLink({ string, link }: Props) {
  const { theme } = useTheme();

  return (
    <Text
      style={{ color: link ? theme.accent : theme.text }}
      disabled={link === undefined || link === ""}
      onPress={link ? () => Linking.openURL(link) : undefined}
    >
      {string}
    </Text>
  );
}
export default function AcknowledgementScreen() {
  const { theme } = useTheme();
  const { confirmUpdateDictionary, metaData } = queryUpdateDictionary();

  return (
    <ScreenWrapper style={commonStyles.centeredFullWidth}>
      <View style={commonStyles.gapXl}>
        <View>
          <Text
            style={[
              commonStyles.textMedium,
              { color: theme.text, textAlign: "center", lineHeight: 30 },
            ]}
          >
            JMDICT Info:
          </Text>
          {metaData?.map((item, i) => {
            return (
              <Text
                key={i}
                style={[
                  commonStyles.textMedium,
                  { color: theme.text, textAlign: "center", lineHeight: 30 },
                ]}
              >
                <Text style={commonStyles.textBM}>{item.key}: </Text>
                <Text>{item.value}</Text>
              </Text>
            );
          })}
        </View>

        <Text
          style={[
            commonStyles.textMedium,
            { color: theme.text, textAlign: "center", lineHeight: 30 },
          ]}
        >
          This is an open source project available at
          <HrefWebLink
            string={" GitHub"}
            link="https://github.com/btwnbrackets/gari"
          />
          . The dictionary lookup uses the
          <HrefWebLink
            string={" JMdict "}
            link="http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project"
          />
          dictionary files, which are the property of the Electronic Dictionary
          Research and Development Group, and are used in conformance with the
          Group's licence. JLPT data comes from
          <HrefWebLink
            string={" Jonathan Waller's JLPT "}
            link="https://www.tanos.co.uk/jlpt/"
          />
          Resources page.
        </Text>

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
      </View>
    </ScreenWrapper>
  );
}
