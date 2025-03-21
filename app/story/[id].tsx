import React from "react";
import queryStory from "@/hooks/story/queryStory";
import SentencesWithAudioController from "@/components/Story/SentencesWithAudioController";
import header from "@/hooks/common/header";
import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";

export default function StoryScreen() {
  const { storyDetails, loadData, search } = queryStory();
  const { showFurigana } = header({
    isFurigana: true,
    search
  });

    return storyDetails && storyDetails?.sentences.length > 0 ? (
      <SentencesWithAudioController
        sentences={storyDetails?.sentences}
        showFurigana={showFurigana}
        updateData={loadData}
      />
    ) : (
      <EmptyScreenMessage message="Nothing to show yet. Add a sentence to the favorite list see it here :D" />
    );
}
