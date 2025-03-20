import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { migrations } from "./migrations";

const DB_NAME = "gari.db";
const DB_PATH = FileSystem.documentDirectory + DB_NAME;
const TEMP_DB_PATH = FileSystem.documentDirectory + "TEMP_" + DB_NAME;

let db: SQLiteDatabase;

const getDatabaseVersion = async (): Promise<number> => {
  const result = (await db.getFirstSync(
    'SELECT value FROM Version WHERE key = "schema_version";'
  )) as { key: string; value: string };
  return result ? parseFloat(result.value) : 1;
};

const setDatabaseVersion = async (version: number) => {
  await db.runAsync(
    'UPDATE Version SET value = ? WHERE key = "schema_version";',
    version
  );
};

const updateDictionary = async () => {
  try {
    const asset = Asset.fromModule(require(`../assets/db/${DB_NAME}`));
    await asset.downloadAsync();
    await FileSystem.copyAsync({ from: asset.localUri!, to: TEMP_DB_PATH });

    await db.execAsync(
      `ATTACH DATABASE '${TEMP_DB_PATH.replace("file://", "")}' AS new_db;`
    );
    await db.execAsync("DELETE FROM DictionaryIndex;");
    await db.execAsync("DELETE FROM Dictionary;");
    await db.execAsync("DELETE FROM DictionaryMeta;");
    await db.execAsync(
      "INSERT INTO DictionaryMeta SELECT * FROM new_db.DictionaryMeta;"
    );
    await db.execAsync(
      "INSERT INTO Dictionary SELECT * FROM new_db.Dictionary;"
    );
    await db.execAsync(
      "INSERT INTO DictionaryIndex SELECT * FROM new_db.DictionaryIndex;"
    );
    await db.execAsync("DETACH DATABASE new_db;");
    console.log("Dictionary updated successfully!");
  } catch (error) {
    console.error("Error updating dictionary:", error);
    try {
      await db.execAsync("DETACH DATABASE new_db;");
    } catch (error2) {
      console.error("Error updating dictionary:", error2);
    }
  }
};

const applyMigrations = async () => {
  const currentVersion = await getDatabaseVersion();
  let isUdateDictionary = false;
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log("migration", migration.version);
      await migration.script(db);
      if (migration.isUdateDictionary) {
        isUdateDictionary = true;
      }
      await setDatabaseVersion(migration.version);
    }
  }
  if (isUdateDictionary) {
    await updateDictionary();
  }
};

export const setupDatabase = async (): Promise<SQLiteDatabase> => {
  try {
    db = await openDatabaseAsync(DB_PATH);

    await db.execAsync("PRAGMA foreign_keys = ON;");

    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS Version (key TEXT PRIMARY KEY, value TEXT);"
    );
    await db.execAsync(
      'INSERT OR IGNORE INTO Version (key, value) VALUES ("schema_version", "1");'
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Story (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      creationDate TEXT NOT NULL,
      readDate TEXT
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Sentence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      audioUri TEXT NOT NULL,
      storyId INTEGER NOT NULL,
      tokens TEXT,
      isFavorite INTEGER DEFAULT 0,
      FOREIGN KEY(storyId) REFERENCES Story(id) ON DELETE CASCADE
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Dictionary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT,
      jlpt INTEGER DEFAULT 0,
      isCommon INTEGER DEFAULT 0
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS DictionaryIndex (
      word TEXT,
      dicId INTEGER,
      
      PRIMARY KEY(word, dicId),
      FOREIGN KEY(dicId) REFERENCES Dictionary(id) ON DELETE CASCADE
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS LookedupWord (
      basicForm TEXT PRIMARY KEY,
      modifiedDate TEXT NOT NULL,
      isFavorite INTEGER DEFAULT 0,
      count INTEGER DEFAULT 0
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS LookedupWordTokens (
      basicForm TEXT PRIMARY KEY,
      wordPosition INTEGER,
      sentenceId INTEGER,
      modifiedDate TEXT NOT NULL,
      
      FOREIGN KEY(basicForm) REFERENCES LookedupWord(basicForm) ON DELETE CASCADE
      FOREIGN KEY(sentenceId) REFERENCES Sentence(id) ON DELETE CASCADE
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Tag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS StoryTag (
      storyId INTEGER NOT NULL,
      tagId INTEGER NOT NULL,
      PRIMARY KEY(storyId, tagId),
      FOREIGN KEY(storyId) REFERENCES Story(id),
      FOREIGN KEY(tagId) REFERENCES Tag(id)
    );`
    );

    await applyMigrations();
    const currentVersion = await getDatabaseVersion();

    console.log("Database setup complete. Version", currentVersion);
  } catch (error) {
    console.log("database setup error", error);
  }
  return db;
};

export { db };
