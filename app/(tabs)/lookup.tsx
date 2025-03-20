import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import SortModal from "@/components/common/SortBottomSlider";
import LookupItem from "@/components/lookedup/LookupItem";
import { commonStyles } from "@/style/commonStyles";
import header from "@/hooks/common/header";
import queryLookedup from "@/hooks/lookedup/queryLookedup";
import { FlatList, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";

export default function LookupScreen() {
  const {
    joinedLookup,
    confirmDeleteLookup,
    confirmDeleteAll,
    sortBy,
    search,
    searchFavorite,
    toggleIsFavorite,
    sortedColumn,
    columns,
  } = queryLookedup();
  const { showFurigana, isModalVisible, onSortClose } = header({
    confirmDeleteAll,
    search,
    searchFavorite,
    isFurigana: true,
    isSort: true,
  });

  return joinedLookup && joinedLookup.length > 0 ? (
    <ScreenWrapper style={commonStyles.scrollContainer}>
      <FlatList
        contentContainerStyle={commonStyles.flatList}
        data={joinedLookup}
        keyExtractor={(item) => item.basicForm.basicForm}
        renderItem={({ item, index }) => {
          return (
            <LookupItem
              item={item}
              showFurigana={showFurigana}
              key={index}
              onDelete={confirmDeleteLookup}
              toggleIsFavorite={toggleIsFavorite}
            />
          );
        }}
      />
      <SortModal
        isVisible={isModalVisible}
        onClose={onSortClose}
        columns={columns}
        sortBy={sortBy}
        sortedColumn={sortedColumn}
      />
    </ScreenWrapper>
  ) : (
    <EmptyScreenMessage message="Nothing to show yet. Look up a word to see it here :D" />
  );
}
