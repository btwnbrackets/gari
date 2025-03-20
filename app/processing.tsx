import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addStory, addSentence } from "@/db/queries";
import { Token } from "@/db/models";
import TokenizerSingleton, { kuromojiTokenizer } from "@/db/TokenizerSingleton";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";

export default function ProcessingScreen() {
  const params = useLocalSearchParams();
  const filename = params.filename as string;
  const textFileUri = params.textFileUri as string;
  const audioFilesUris = JSON.parse(
    params.audioFilesUris as string
  ) as string[];

  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const processFiles = async (tokenizer: kuromojiTokenizer | undefined) => {
      try {
        if (
          !filename ||
          !textFileUri ||
          !audioFilesUris ||
          audioFilesUris.length === 0
        ) {
          Alert.alert("Error", "Missing files!");
          router.push("/upload");
          return;
        }

        const textContent = await FileSystem.readAsStringAsync(textFileUri);
        const sentences = textContent
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        const storyCreationDate = new Date().toISOString();
        const storyDir = `${FileSystem.documentDirectory}story/${storyCreationDate}`;
        await FileSystem.makeDirectoryAsync(storyDir, { intermediates: true });

        const audioDir = `${storyDir}/audio`;
        await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });

        const movedAudioFiles: string[] = [];
        for (const fileUri of audioFilesUris) {
          const fileName = fileUri.split("/").pop();
          const newFilePath = `${audioDir}/${fileName}`;
          await FileSystem.copyAsync({ from: fileUri, to: newFilePath });
          movedAudioFiles.push(newFilePath);
        }

        const dbStoryId = await addStory(filename, storyCreationDate);
        for (
          let i = 0;
          i < Math.min(sentences.length, movedAudioFiles.length);
          i++
        ) {
          let tokens: Token[] = [];
          if (tokenizer) {
            try {
              const kuromoji_tokens = tokenizer.tokenize(sentences[i]);
              tokens = kuromoji_tokens.map((token) => {
                if (typeof token.surface_form == "string") {
                  return {
                    surfaceForm: token.surface_form,
                    basicForm: token.basic_form,
                    reading: token.reading ? token.reading : "",
                    wordPosition: token.word_position,
                  } as Token;
                } else {
                  return {} as Token;
                }
              });
            } catch (error) {
              console.error(
                `tokenizer error for sentence ${sentences[i]}`,
                error
              );
            }
          } else {
            console.log("no tokenization");
          }
          await addSentence(
            sentences[i],
            movedAudioFiles[i],
            dbStoryId,
            JSON.stringify(tokens)
          );
        }
        Alert.alert(
          "Success",
          `Processed ${sentences.length} sentences & ${movedAudioFiles.length} audio files!`
        );

        router.replace("/");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to process files.");
        router.push("/upload");
      } finally {
        setIsProcessing(false);
      }
    };
    const loadTokerizer = async () => {
      try {
        const tokenizerInstance = TokenizerSingleton.getInstance();
        const tokenizer = await tokenizerInstance.initialize();

        processFiles(tokenizer);
      } catch (error) {
        console.error("kuromoji error:", error);
      }
    };

    loadTokerizer();
  }, []);

  return (
    <EmptyScreenMessage message="Processing files...">
      {isProcessing && <ActivityIndicator size="large" />}
    </EmptyScreenMessage>
  );
}
