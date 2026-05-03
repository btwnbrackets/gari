import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AppState, BackHandler } from "react-native";
import { Audio } from "expo-av";
import { Sentence } from "@/db/models";
import { useFocusEffect, useNavigation } from "expo-router";
import React from "react";

type Props = {
  sentences: Sentence[] | undefined;
  scrollToItem: (index: number) => void;
};

export default function useAudioControl({ sentences, scrollToItem }: Props) {
  const navigation = useNavigation();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentActive, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentActiveRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const isPlayingAllRef = useRef(false);
  const isRepeatRef = useRef(false);
  const isLoadingRef = useRef(false);

  const setCurrentSound = useCallback((nextSound: Audio.Sound | null) => {
    soundRef.current = nextSound;
    setSound(nextSound);
  }, []);

  const setCurrentActive = useCallback((index: number | null) => {
    currentActiveRef.current = index;
    setActive(index);
  }, []);

  const setPlaying = useCallback((playing: boolean) => {
    isPlayingRef.current = playing;
    setIsPlaying(playing);
  }, []);

  const setPlayingAll = useCallback((playingAll: boolean) => {
    isPlayingAllRef.current = playingAll;
    setIsPlayingAll(playingAll);
  }, []);

  const stopSound = useCallback(async () => {
    const activeSound = soundRef.current;
    setCurrentSound(null);
    setPlaying(false);
    setPlayingAll(false);

    if (activeSound) {
      activeSound.setOnPlaybackStatusUpdate(null);
      try {
        await activeSound.stopAsync();
      } catch {}
      try {
        await activeSound.unloadAsync();
      } catch {}
    }
  }, [setCurrentSound, setPlaying, setPlayingAll]);

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      stopSound();
    });

    return unsubscribe;
  }, [navigation, stopSound]);

  // losing focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stopSound();
      };
    }, [stopSound])
  );

  // app close or in bg
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        stopSound();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [stopSound]);

  // back button
  useEffect(() => {
    const handleBackPress = () => {
      stopSound();
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, [stopSound]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  const playAudio = async (id: number, forcePlay = false) => {
    if (!sentences || id < 0 || id >= sentences.length) {
      return;
    }
    if (isLoadingRef.current) {
      return;
    }

    const fileUri: string = sentences[id].audioUri;
    try {
      isLoadingRef.current = true;
      scrollToItem(id);

      const activeSound = soundRef.current;
      const activeIndex = currentActiveRef.current;

      if (activeSound) {
        if (id !== activeIndex) {
          activeSound.setOnPlaybackStatusUpdate(null);
          await activeSound.unloadAsync();
          setCurrentSound(null);
          setCurrentActive(null);
        } else {
          if (isPlayingRef.current && !forcePlay) {
            await activeSound.pauseAsync();
            setPlaying(false);
            return;
          } else {
            await activeSound.playAsync();
            setPlaying(true);
            return;
          }
        }
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: fileUri,
      });

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaying(status.isPlaying);
          if (status.didJustFinish) {
            handleTrackFinished(newSound);
          }
        }
      });

      setCurrentSound(newSound);
      setCurrentActive(id);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play audio.");
    } finally {
      isLoadingRef.current = false;
    }
  };

  const handleTrackFinished = async (finishedSound: Audio.Sound) => {
    finishedSound.setOnPlaybackStatusUpdate(null);

    if (isRepeatRef.current && !isPlayingAllRef.current) {
      await finishedSound.replayAsync();
      setPlaying(true);
      return;
    }

    const activeIndex = currentActiveRef.current;
    const sentenceCount = sentences?.length ?? 0;
    setCurrentSound(null);
    setPlaying(false);

    try {
      await finishedSound.unloadAsync();
    } catch {}

    if (activeIndex === null || !isPlayingAllRef.current || sentenceCount === 0) {
      setPlayingAll(false);
      return;
    }

    const nextIndex = activeIndex + 1;
    if (nextIndex < sentenceCount) {
      playAudio(nextIndex, true);
    } else if (isRepeatRef.current) {
      playAudio(0, true);
    } else {
      setPlayingAll(false);
    }
  };

  const toggleRepeat = () =>
    setIsRepeat((prev) => {
      const next = !prev;
      isRepeatRef.current = next;
      return next;
    });

  const playSentence = (index: number) => {
    setPlayingAll(false);
    playAudio(index);
  };

  const playAll = () => {
    if (!sentences || sentences.length === 0) {
      return;
    }

    const activeIndex = currentActiveRef.current;
    const nextIndex =
      activeIndex !== null && activeIndex < sentences.length
        ? activeIndex
        : 0;

    setPlayingAll(true);
    playAudio(nextIndex, true);
  };

  return {
    sound,
    currentActive,
    isPlaying,
    isPlayingAll,
    isRepeat,
    playAudio,
    toggleRepeat,
    playSentence,
    playAll,
  };
}
