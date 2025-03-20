import HeaderBar from "@/components/common/HeaderBar";
import { useTheme } from "@/style/ThemeProvider";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

type Props = {
  confirmDeleteAll?: () => void;
  add?: () => void;
  searchFavorite?: (showFavorite: boolean) => void;
  search?: (word: string) => void;
  isFurigana?: boolean;
  isSort?: boolean;
  isInfo?: boolean;
};

export default function header({
  add,
  confirmDeleteAll,
  search,
  searchFavorite,
  isSort,
  isFurigana,
  isInfo
}: Props) {
  const navigation = useNavigation();
  const router = useRouter();

  const [showFurigana, setShowFurigana] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showFavorite, setShowFavorite] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  const toggleFurigana = () => {
    setShowFurigana((prev) => !prev);
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const toggleShowFavorite = () => {
    if (searchFavorite) {
      setShowFavorite((prev) => {
        searchFavorite(!prev);
        return !prev;
      });
    }
  };

  const toggleSort = () => {
    setIsModalVisible((prev) => !prev);
  };

  const onSortClose = () => {
    setIsModalVisible(false);
  };

  const setSearchWord = (newSearchTerm: string) => {
    if (search) {
      search(newSearchTerm);
    }
  };

  const headerRight = () =>
    HeaderBar({
      toggleFurigana: isFurigana? toggleFurigana: undefined,
      showFurigana,
      confirmDeleteAll,
      isModalVisible,
      toggleSort: isSort? toggleSort: undefined,
      toggleSearch,
      showSearch,
      setSearchWord: search && setSearchWord,
      toggleShowFavorite: searchFavorite && toggleShowFavorite,
      showFavorite,
      add: add? add: undefined,
      theme: theme, 
      toggleTheme:toggleTheme,
      toInfo: isInfo? () => {
        router.push("/acknowledgement");
      } : undefined,
    });

  useEffect(() => {
    const setNavBar = async () => {
      navigation.setOptions({ headerRight: headerRight });
    };
    setNavBar();
  }, [navigation, showFurigana, isModalVisible, showSearch, showFavorite, theme]);

  useEffect(() => {
    const keyboardListener = Keyboard.addListener("keyboardDidHide", () => {
      setShowSearch(false);
    });

    return () => keyboardListener.remove();
  }, [showSearch]);

  return {
    showFurigana,
    isModalVisible,
    onSortClose,
    theme,
  };
}
