import { Alert, Linking } from "react-native";
import { getDictionaryMetaData, updateDictionaryData } from "@/db/queries";
import { useEffect, useState } from "react";
import { DictionaryMetaData } from "@/db/models";
import Constants from "expo-constants";

export default function queryUpdateDictionary() {
  const [metaData, setMetaData] = useState<DictionaryMetaData[]>();

  const currentVersion = Constants.expoConfig?.version ?? "1.0.0";

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

  const checkForUpdate = async () => {
    try {
      const res = await fetch(
        "https://api.github.com/repos/btwnbrackets/gari/releases/latest"
      );
      const data = await res.json();

      console.log(data)

      const latestVersion = data.tag_name?.replace(/^v/, "") ?? "0.0.0"; // Assuming tags are like v1.2.3
      const releaseUrl = data.html_url;

      if (isNewerVersion(latestVersion, currentVersion)) {
        Alert.alert(
          "Update Available",
          `A new version (${latestVersion}) is available!`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "View", onPress: () => Linking.openURL(releaseUrl) },
          ]
        );
      } else {
        Alert.alert(
          "You're up to date!",
          `Version ${currentVersion} is the latest.`
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to check for updates.");
      console.error(err);
    }
  };

  const isNewerVersion = (latest: string, current: string): boolean => {
    const latestParts = latest.split(".").map(Number);
    const currentParts = current.split(".").map(Number);

    for (
      let i = 0;
      i < Math.max(latestParts.length, currentParts.length);
      i++
    ) {
      const l = latestParts[i] ?? 0;
      const c = currentParts[i] ?? 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  };

  useEffect(() => {
    getMetaData();
  }, [metaData]);

  return {
    confirmUpdateDictionary,
    metaData,
    checkForUpdate,
  };
}
