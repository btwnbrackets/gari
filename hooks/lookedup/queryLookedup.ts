import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getAllLookups, deleteLookup, deleteAllLookup, toggleIsFavoriteLookup } from "@/db/queries";

import { GroupedLookedup } from "@/db/models";
import { useNavigation } from "expo-router";

export default function queryLookedup() {
  const navigation = useNavigation();
  const [joinedLookup, setJoinedLookup] = useState<
    GroupedLookedup[] | undefined
  >(undefined);


  const [sortedColumn, setSortedColumn] = useState<{
    column: string;
    isAsc: boolean;
  }>({ column: "modifiedDate", isAsc: false });


  const [searchWord, setSearchWord] = useState<string>("");
  const [showFavorite, setShowFavorite] = useState(false);

  const columns = [
    { key: "count", value: "Search Frequency" },
    { key: "modifiedDate", value: "Most Recent Search" },
    { key: "basicForm", value: "Alphabetically" },
  ];

  const loadData = async () => {
    console.log("load joinedLookup");
    try {
      const data = await getAllLookups(sortedColumn.column, sortedColumn.isAsc, searchWord, showFavorite);
      setJoinedLookup(data);
    } catch (error) {
      console.error("Error loading joinedLookup data:", error);
      Alert.alert("Error", "Failed to load joinedLookup data.");
    }
  };

  const sortBy = (column: string) => {
    setSortedColumn((prev) => {
      return {
        column: column,
        isAsc: prev.column == column ? !prev.isAsc : false,
      };
    });
  };

  const search = (word: string) => {
    setSearchWord(word);
  }

  const searchFavorite = (favorite: boolean) => {
    setShowFavorite(favorite);
  }

  const onDelete = async (basicForm: string) => {
    try {
      await deleteLookup(basicForm);
      await loadData();
    } catch (error) {
      console.error("Error deleting lookup:", error);
    }
  };

  
  const toggleIsFavorite = async (basicForm: string) => {
    console.log("toggleIsFavorite in query lookedup")
    try {
      await toggleIsFavoriteLookup(basicForm);
      await loadData();
    } catch (error) {
      console.error("Error toggle favorite:", error);
    }
  };

  const confirmDeleteLookup = (
    basicForm: string,
    closeCallback: () => void
  ) => {
    Alert.alert(
      "Delete Lookup",
      "Are you sure you want to delete this lookup?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            closeCallback();
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(basicForm);
            closeCallback();
          },
        },
      ]
    );
  };

  const onDeleteAll = async () => {
    try {
      await deleteAllLookup();
      await loadData();
    } catch (error) {
      console.error("Error deleting lookups:", error);
    }
  };

  const confirmDeleteAll = () => {
    Alert.alert(
      "Delete All Lookup data",
      "Are you sure you want to delete all lookup data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteAll();
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadData();

    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation, sortedColumn, searchWord, showFavorite]);

  return {
    joinedLookup,
    confirmDeleteLookup,
    confirmDeleteAll,
    sortBy,
    columns,
    sortedColumn,
    search,
    searchFavorite,
    toggleIsFavorite
  };
}
