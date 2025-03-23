import ScreenWrapper from "@/components/common/ScreenWrapper";
import queryUpdateDictionary from "@/hooks/about/queryAbout";
import { commonStyles } from "@/style/commonStyles";
import { ScrollView } from "react-native";

import Acknowledgement from "@/components/about/acknowledgement";
import AppInfo from "@/components/about/appInfo";
import DatabaseUpdate from "@/components/about/updateDatabase";

export default function AboutScreen() {
  const { confirmUpdateDictionary, metaData, checkForUpdate } =
    queryUpdateDictionary();

  return (
    <ScreenWrapper style={commonStyles.centeredFullWidth}>
      <ScrollView>
        <Acknowledgement />
        <AppInfo metaData={metaData} checkForUpdate={checkForUpdate} />
        <DatabaseUpdate confirmUpdateDictionary={confirmUpdateDictionary} />
      </ScrollView>
    </ScreenWrapper>
  );
}
