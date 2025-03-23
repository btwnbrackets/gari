![Version](https://img.shields.io/github/v/tag/btwnbrackets/gari)
![License](https://img.shields.io/github/license/btwnbrackets/gari)

# Welcome to Gari!

Gari is an offline, open-source Japanese reading and shadowing app. Current features:

* audio player: play, repeat, repeat all, play all, forward, backward
* offline dictionary lookup
* automatic furigana generator
* dark and light themes

You can search, sort, delete your collection, as well as put sentences and lookups into favorites.

This project is written in ReactNative with expo. It should run in Android and iOS without issues.


## Development and Code Organization

### Contribution

You are more than welcome to fork and contribute to this project :) `TODO.md` contains some TODOs I hope to implement. But you can do whatever you think is more useful too :D

### JMDICT Data

The dictionary data are first made using the python script available at `/script`. Once created, move the files to `/assets/db`.


### Database and Dictionary Updates 

If you want to update the dictionary data (e.g. newwer release) or modify the database, create a migration push in `/db/migrations.ts` as such:

```ts
migrations.push({
  version: 2, 
  isUdateDictionary: true,
  script: async (db: SQLiteDatabase) => {
    await db.execAsync(
      "ALTER TABLE Dictionary ADD COLUMN jlpt INTEGER DEFAULT 0;"
    );
  },
});
```

The `version` is a number (could be float as well like `2.1`), and it must be higher than the current app version to run your changes. `isUdateDictionary` is a boolean. If it is true, the dictionary data will be re-read from `/assets/db/gari.db`. And `script` is a function that runs your SQLite table modifications.


The database API is exposed in functions defined in `db/queries.ts`


### Models

All database types are defined in `db/models.ts`. If you modify the database tables, reflect your type changes there as well


### Tokenization

Tokenization is done using [my fork](https://github.com/btwnbrackets/react-native-kuromoji) of [CharlesCoeder/react-native-kuromoji](https://github.com/CharlesCoeder/react-native-kuromoji) available at `src/kuromoji`. This folder will most likely be removed soon and replaced with an installed library. The tokenization singleton code is at `db\TokenizerSingleton.ts`.


### Screens

the `app` and `components` folders contains the code for building the screens. `hooks` provides the states and queries call. `style` contains the theme and common styles and constants.


## Acknowledgement

The dictionary lookup uses the [JMdict](http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) dictionary files, which are the property of the Electronic Dictionary Research and Development Group, and are used in conformance with the Group's licence. 

JLPT data comes from [Jonathan Waller's JLPT](https://www.tanos.co.uk/jlpt/) Resources page.