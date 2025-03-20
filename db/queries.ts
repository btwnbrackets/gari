import { getDateLabel } from "@/src/utils/dates";
import { db } from "./database";
import {
  Dictionary,
  GroupedByHistory,
  GroupedLookedup,
  JMdictWord,
  LookedupJoin,
  Sentence,
  SentenceRaw,
  Story,
  StoryDetails,
  Token,
} from "./models";

export const addStory = async (
  name: string,
  creationDate: string
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO Story (name, creationDate) VALUES (?, ?)",
    name,
    creationDate
  );
  return result.lastInsertRowId;
};

export const addSentence = async (
  content: string,
  audioUri: string,
  storyId: number,
  tokens: string
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO Sentence (content, audioUri, storyId, tokens) VALUES (?, ?, ?, ?)",
    content,
    audioUri,
    storyId,
    tokens
  );
  return result.lastInsertRowId;
};

export const addLookup = async (
  basicForm: string,
  sentenceId: number,
  wordPosition: number,
  modifiedDate: string
): Promise<Number[]> => {
  const insertResult = await db.runAsync(
    `
    INSERT INTO LookedupWord (basicForm, modifiedDate, count)
    VALUES (?, ?, 1)
    ON CONFLICT(basicForm) DO UPDATE SET
    count = count + 1,
    modifiedDate = ?;`,
    [basicForm, modifiedDate, modifiedDate]
  );

  const result = await db.runAsync(
    `
    INSERT OR REPLACE INTO LookedupWordTokens (basicForm, sentenceId, wordPosition, modifiedDate)
    VALUES (?, ?, ?, ?)`,
    [basicForm, sentenceId, wordPosition, modifiedDate]
  );
  return [insertResult.lastInsertRowId, result.lastInsertRowId];
};

export const addHistory = async (
  storyId: number,
  modifiedDate: string
): Promise<number> => {
  console.log("save hist");
  const result = await db.runAsync(
    "UPDATE Story SET readDate = ? WHERE id = ?",
    modifiedDate,
    storyId
  );
  return result.lastInsertRowId;
};

export const deleteHistoy = async (storyId: number): Promise<number> => {
  const result = await db.runAsync(
    "UPDATE Story SET readDate = NULL WHERE id = ?",
    storyId
  );
  return result.lastInsertRowId;
};

export const toggleIsFavoriteLookup = async (
  basicForm: string
): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE LookedupWord
    SET isFavorite = CASE
      WHEN isFavorite = 0 THEN 1
      WHEN isFavorite = 1 THEN 0
    END
    WHERE
        basicForm = ? `,
    basicForm
  );
  return result.lastInsertRowId;
};

export const toggleIsFavoriteSentence = async (id: number): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE Sentence
    SET isFavorite = CASE
      WHEN isFavorite = 0 THEN 1
      WHEN isFavorite = 1 THEN 0
    END
    WHERE
        id = ? `,
    id
  );
  return result.lastInsertRowId;
};

export const getAllStories = async (
  column: string,
  asc: boolean,
  searchWord: string
): Promise<Story[]> => {
  const allRows = await db.getAllAsync(
    `SELECT * FROM Story 
    ${searchWord != "" ? "WHERE name LIKE '%" + searchWord + "%'" : ""}
    ORDER BY ${column} ${asc ? "ASC" : "DESC"};
    `
  );
  return allRows as Story[];
};

export const getAllHistory = async (
  searchWord: string
): Promise<GroupedByHistory> => {
  const allRows = (await db.getAllAsync(`
    SELECT *
    FROM Story 
    WHERE readDate IS NOT NULL
    ${searchWord != "" ? " AND name LIKE '%" + searchWord + "%'" : ""}
    ORDER BY readDate DESC;
  `)) as Story[];

  return allRows.reduce((groups: Record<string, any[]>, item) => {
    let label = getDateLabel(item.readDate);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {});
};

export const getAllFavoriteSentences = async (
  searchWord: string
): Promise<Sentence[]> => {
  const allRows = (await db.getAllAsync(`
    SELECT *
    FROM Sentence
    WHERE isFavorite = 1
    ${searchWord != "" ? " AND content LIKE '%" + searchWord + "%'" : ""}

  `)) as SentenceRaw[];

  const sentence = allRows.map((sentence) => {
    return {
      ...sentence,
      isFavorite: sentence.isFavorite == 1 ? true : false,
      tokens: (sentence.tokens && JSON.parse(sentence.tokens)) as Token[],
    } as Sentence;
  });
  return sentence;
};

export const getAllLookups = async (
  column: string,
  asc: boolean,
  searchWord: string,
  showFavorite: boolean
): Promise<GroupedLookedup[]> => {
  const allRows = (await db.getAllAsync(`
    SELECT
    lw.basicForm AS basicForm, lw.isFavorite AS isFavorite, lw.count AS count, lw.modifiedDate AS modifiedDate,
    lwt.wordPosition AS wordPosition, lwt.sentenceId AS sentenceId, lwt.modifiedDate AS tokenModifiedDate,
    s.tokens AS tokens,
    d.id AS dicId, d.data AS data, d.jlpt AS jlpt, d.isCommon AS isCommon
    FROM LookedupWord lw
    INNER JOIN LookedupWordTokens lwt ON lw.basicForm = lwt.basicForm
    INNER JOIN Sentence s ON s.id = lwt.sentenceId
    INNER JOIN DictionaryIndex di ON di.word = lw.basicForm
    INNER JOIN Dictionary d ON di.dicId = d.id
    ${showFavorite ? "WHERE lw.isFavorite = 1" : ""}
    ${showFavorite && searchWord != "" ? " AND " : ""}
    ${!showFavorite && searchWord != "" ? " WHERE " : ""}
    ${searchWord != "" ? "lwt.basicForm LIKE '%" + searchWord + "%'" : ""}
    ORDER BY lw.${column} ${asc ? "ASC" : "DESC"}, lwt.modifiedDate DESC,  d.isCommon DESC, d.jlpt DESC, di.dicId DESC;
  `)) as LookedupJoin[];

  const groupedMap = new Map<string, GroupedLookedup>();

  for (const item of allRows) {
    if (!groupedMap.has(item.basicForm)) {
      groupedMap.set(item.basicForm, {
        basicForm: {
          basicForm: item.basicForm,
          isFavorite: item.isFavorite === 1 ? true : false,
          count: item.count,
          modifiedDate: item.modifiedDate,
        },
        tokenSentences: [],
        dictionary: [],
      });
    }

    const group = groupedMap.get(item.basicForm)!;

    let sentenceEntry = group.tokenSentences.find(
      (s) => s.sentenceId === item.sentenceId
    );

    if (!sentenceEntry) {
      sentenceEntry = {
        wordPosition: item.wordPosition,
        tokenModifiedDate: item.tokenModifiedDate,
        sentenceId: item.sentenceId,
        tokens: (item.tokens && JSON.parse(item.tokens)) as Token[],
      };
      group.tokenSentences.push(sentenceEntry);
    }

    let dictionaryEntry = group.dictionary.find(
      (s) => s.id === item.dicId
    );

    if (!dictionaryEntry) {
        dictionaryEntry = {
        id: item.dicId,
        jlpt: item.jlpt,
        data: (item.data && JSON.parse(item.data)) as JMdictWord,
        isCommon: item.isCommon
      };
      group.dictionary.push(dictionaryEntry);
    }
  }

  return Array.from(groupedMap.values());
};

export const getSortedStories = async (
  sortBy: "name" | "date",
  asc: boolean
): Promise<Story[]> => {
  const orderByClause =
    (sortBy === "name" ? "ORDER BY name" : "ORDER BY creationDate") +
    (asc ? "ASC" : "DESC");
  const allRows = await db.getAllAsync(`SELECT * FROM Story ${orderByClause};`);
  return allRows as Story[];
};

export const getStoryDetails = async (
  storyId: number,
  searchWord: string
): Promise<StoryDetails> => {
  const story = await db.getFirstAsync("SELECT * FROM Story WHERE id = ?;", [
    storyId,
  ]);
  const sentences = (await db.getAllAsync(
    `
    SELECT * 
    FROM Sentence
    WHERE storyId = ?
    ${searchWord != "" ? "AND content LIKE '%" + searchWord + "%'" : ""}
  `,
    [storyId]
  )) as SentenceRaw[];

  const storyDetails = {
    story,
    sentences: sentences.map((sentence) => {
      return {
        ...sentence,
        isFavorite: sentence.isFavorite == 1 ? true : false,
        tokens: (sentence.tokens && JSON.parse(sentence.tokens)) as Token[],
      } as Sentence;
    }),
  } as StoryDetails;
  return storyDetails;
};

export const lookupWord = async (basicForm: string): Promise<Dictionary[]> => {
  const lookups = await db.getAllAsync(
    `
    SELECT d.*
    FROM Dictionary d
    INNER JOIN DictionaryIndex i ON i.dicId = d.id
    WHERE i.word = ?
  `,
    [basicForm]
  );
  if (lookups && Array.isArray(lookups)) {
    const entries: Dictionary[] = lookups
      .map((lookup) => {
        try {
          const entry = lookup as { id: Number; data: string, jlpt: number, isCommon: number };
          return {
            ...entry,
            data: JSON.parse(entry.data) as JMdictWord,
          } as Dictionary;
        } catch (error) {
          console.error("Error parsing lookup data", error);
          return null;
        }
      })
      .filter((entry) => entry !== null);
    return entries;
  }
  return [];
};

export const deleteStory = async (storyId: number): Promise<number> => {
  const result = await db.runAsync("DELETE FROM Story WHERE id = ?", storyId);
  return result.lastInsertRowId;
};

export const deleteAllHistory = async (): Promise<number> => {
  const result = await db.runAsync(
    "DELETE FROM Story WHERE readDate IS NOT NULL"
  );
  return result.lastInsertRowId;
};

export const deleteAllStory = async (): Promise<number> => {
  const result = await db.runAsync("DELETE FROM Story");
  return result.lastInsertRowId;
};

export const deleteLookup = async (basicForm: string): Promise<number> => {
  const result = await db.runAsync(
    "DELETE FROM LookedupWord WHERE basicForm = ?",
    basicForm
  );
  return result.lastInsertRowId;
};

export const deleteAllLookup = async (): Promise<number> => {
  const result = await db.runAsync("DELETE FROM LookedupWord");
  return result.lastInsertRowId;
};

export const deleteIsFavoriteSentence = async (id: number): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE Sentence
    SET isFavorite = 0
    WHERE id = ? `,
    id
  );
  return result.lastInsertRowId;
};

export const deleteAllFavoriteSentences = async (): Promise<number> => {
  const result = await db.runAsync(
    `
    UPDATE Sentence
    SET isFavorite = 0`
  );
  return result.lastInsertRowId;
};
