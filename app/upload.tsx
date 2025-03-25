import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import BasicButton from "@/components/common/BasicButton";
import { TextInput } from "react-native-gesture-handler";
import { commonStyles } from "@/style/commonStyles";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useTheme } from "@/style/ThemeProvider";

export default function UploadScreen() {
  const { theme } = useTheme();

  const [textFile, setTextFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [audioFiles, setAudioFiles] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [filename, setFilename] = useState<string>("");
  const router = useRouter();

  const pickTextFile = async () => {
    console.log("picking a text file open");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setTextFile(result);
      setFilename(result.assets[0].name.replace(".txt", ""));
    } catch (error) {
      Alert.alert("Error", "Failed to pick a text file.");
    }
  };

  const pickAudioFiles = async () => {
    console.log("picking audio files open");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      setAudioFiles(result);
    } catch (error) {
      Alert.alert("Error", "Failed to pick audio files.");
    }
  };

  const handleProceed = () => {
    if (!textFile || !audioFiles) {
      Alert.alert("Error", "Please upload both a text file and audio files.");
      return;
    }
    router.push({
      pathname: "/processing",
      params: {
        filename: filename,
        textFileUri: textFile?.assets?.[0]?.uri,
        audioFilesUris: JSON.stringify(
          audioFiles?.assets
            ?.sort((a, b) => a.name.localeCompare(b.name))
            ?.map((file) => file.uri)
        ),
      },
    });
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={[commonStyles.textBM, { color: theme.text }]}>
        Upload Text & Audio Files
      </Text>

      <BasicButton title="Pick Text File" onPress={pickTextFile} />
      {textFile && (
        <Text style={[commonStyles.normalText, { color: theme.text }]}>
          {textFile?.assets?.[0]?.name}
        </Text>
      )}

      <BasicButton title="Pick Audio Files" onPress={pickAudioFiles} />
      {audioFiles && (
        <Text style={[commonStyles.normalText, { color: theme.text }]}>
          {audioFiles?.assets?.length} files selected
        </Text>
      )}

      {textFile && (
        <TextInput
          placeholderTextColor={theme.text + "99"}
          value={filename}
          onChange={(event) => setFilename(event.nativeEvent.text)}
          placeholder="story name"
          style={[
            commonStyles.inputText,
            { color: theme.text, borderColor: theme.accent },
          ]}
        />
      )}
      <BasicButton
        title="Proceed"
        onPress={handleProceed}
        disabled={!textFile || !audioFiles}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centeredFullWidth,
    ...commonStyles.gapL,
  },
});
