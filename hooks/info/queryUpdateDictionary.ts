import { Alert } from "react-native";
import { getDictionaryMetaData, updateDictionaryData } from "@/db/queries";
import { useEffect, useState } from "react";

export default function queryUpdateDictionary() {
  const [metaData, setMetaData] = useState<{ key: string; value: string }[]>();

  const UpdateDictionary = async () => {
    try {
      const ver = await updateDictionaryData();
      if (ver) {
        Alert.alert(
          "Success",
          `Updated the dictionary data to JMDICT Ver. ${ver}!`
        );
        getMetaData();
      } else {
        Alert.alert("Error", "Error updating dictionary data");
      }
    } catch (error) {
      console.error("Error updating dictionary data:", error);
      Alert.alert("Error", "Error updating dictionary data");
    }
  };

  const getMetaData = async () => {
    try {
      const data = await getDictionaryMetaData();
      setMetaData(data);
    } catch (error) {
      console.error("Error updating dictionary data:", error);
    }
  };

  const confirmUpdateDictionary = () => {
    Alert.alert(
      "Update Dictionary",
      "Are you sure you want to update the dictionary data? this may take a few minutes.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          style: "default",
          onPress: () => {
            UpdateDictionary();
          },
        },
      ]
    );
  };

  useEffect(() => {
    getMetaData();
  }, [metaData]);


  return {
    confirmUpdateDictionary,
    metaData
  };
}
