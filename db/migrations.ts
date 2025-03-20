import { SQLiteDatabase } from "expo-sqlite";

export const migrations: {
  version: number;
  isUdateDictionary: boolean;
  script: (db: SQLiteDatabase) => Promise<void>;
}[] = [];

migrations.push({
  version: 1.1,
  isUdateDictionary: true,
  script: async (db: SQLiteDatabase) => {}
})

/** example migration 
migrations.push({
  version: 0.01,
  isUdateDictionary: false,
  script: async (db: SQLiteDatabase) => {
    await db.execAsync(
      "ALTER TABLE Dictionary ADD COLUMN jlpt INTEGER DEFAULT 0;"
    );
  },
});
*/