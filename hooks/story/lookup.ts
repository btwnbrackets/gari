import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { Token } from "@/db/models";
import { addLookup } from "@/db/queries";
import { ANIMATION_DURATION } from "@/style/animation";

const END_POSITION = 500;


export default function lookup() {
  const [lookupWord, setLookupWord] = useState<{basicForm: string, sentenceId: number, wordPosition: number} | null>(null);
  const deltaY = useSharedValue(ANIMATION_DURATION);

  const slideDown = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        deltaY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (deltaY.value > END_POSITION / 2) {
        deltaY.value = withTiming(
          END_POSITION,
          { duration: ANIMATION_DURATION },
          (finished) => {
            if (finished) {
              runOnJS(setLookupWord)(null);
            }
          }
        );
      } else {
        deltaY.value = withTiming(0, { duration: ANIMATION_DURATION });
      }
    });

  const expandPopup = (flag: boolean) => {
    if (flag) {
      deltaY.value = END_POSITION;
    }
    deltaY.value = withTiming(0, { duration: ANIMATION_DURATION });
  };
  const hidePopup = (flag: boolean) => {
    if (flag) {
      deltaY.value = 0;
    }
    deltaY.value = withTiming(END_POSITION, { duration: ANIMATION_DURATION });
  };
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: deltaY.value,
        },
      ],
    };
  });

  useEffect(() => {
    const onBackPress = () => {
      if (lookupWord) {
        onLookupBoxClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [lookupWord]);

  const onTapWord = async (token: Token, sentenceId: number, wordPosition: number) => {
    if (lookupWord == null) {
      setLookupWord({basicForm: token.basicForm, sentenceId, wordPosition});
      expandPopup(true);
    } else {
      setLookupWord({basicForm: token.basicForm, sentenceId, wordPosition});
      expandPopup(false);
    }

    try {
      console.log("add lookup")
      const modifiedDate = new Date().toISOString();
      await addLookup(token.basicForm, sentenceId, wordPosition, modifiedDate);
    } catch (error) {
      console.error(
        `error addLookup basicForm (${token.basicForm}):`,
        error
      );
    }
  };

  const onLookup = (isFound: boolean) => {
    if (!isFound) {
      onLookupBoxClose();
    }
  };

  const onLookupBoxClose = () => {
    setLookupWord(null);
    hidePopup(false);
  };

  return {
    lookupWord,
    slideDown,
    onLookup,
    onTapWord,
    containerStyle,
  };
}
