import kuromoji from "@/src/kuromoji/kuromoji";
import { Asset } from "expo-asset";
import { KUROMOJI_TOKEN } from "./models";

export interface kuromojiTokenizer {
  tokenize: (arg0: string) => KUROMOJI_TOKEN[];
}

class TokenizerSingleton {
  private static instance: TokenizerSingleton;
  private tokenizer: kuromojiTokenizer | undefined = undefined;
  private isLoading: Promise<kuromojiTokenizer> | undefined = undefined;

  private constructor() {}

  static getInstance(): TokenizerSingleton {
    if (!TokenizerSingleton.instance) {
      TokenizerSingleton.instance = new TokenizerSingleton();
    }
    return TokenizerSingleton.instance;
  }

  async initialize(): Promise<kuromojiTokenizer | undefined> {
    if (this.tokenizer) {
      return this.tokenizer;
    }
    if (this.isLoading) {
      return this.isLoading;
    }

    console.log("loading tokenizer...");

    this.isLoading = new Promise(async (resolve, reject) => {
      try {
        const assets = {
          "base.dat.gz": Asset.fromModule(
            require("../assets/dict/base.dat.gz")
          ),
          "cc.dat.gz": Asset.fromModule(require("../assets/dict/cc.dat.gz")),
          "check.dat.gz": Asset.fromModule(
            require("../assets/dict/check.dat.gz")
          ),
          "tid.dat.gz": Asset.fromModule(require("../assets/dict/tid.dat.gz")),
          "tid_map.dat.gz": Asset.fromModule(
            require("../assets/dict/tid_map.dat.gz")
          ),
          "tid_pos.dat.gz": Asset.fromModule(
            require("../assets/dict/tid_pos.dat.gz")
          ),
          "unk.dat.gz": Asset.fromModule(require("../assets/dict/unk.dat.gz")),
          "unk_char.dat.gz": Asset.fromModule(
            require("../assets/dict/unk_char.dat.gz")
          ),
          "unk_compat.dat.gz": Asset.fromModule(
            require("../assets/dict/unk_compat.dat.gz")
          ),
          "unk_invoke.dat.gz": Asset.fromModule(
            require("../assets/dict/unk_invoke.dat.gz")
          ),
          "unk_map.dat.gz": Asset.fromModule(
            require("../assets/dict/unk_map.dat.gz")
          ),
          "unk_pos.dat.gz": Asset.fromModule(
            require("../assets/dict/unk_pos.dat.gz")
          ),
        };
        kuromoji
          .builder({ assets })
          .build((err: any, tokenizer: { tokenize: (arg0: string) => any }) => {
            if (err) {
              console.error("kuromoji error:", err);
              reject(err);
            } else {
              console.log("tokenizer loaded");
              this.tokenizer = tokenizer;
              resolve(tokenizer);
            }
          });
      } catch (error) {
        console.error("kuromoji error:", error);
        reject(error);
      }
    });
    return this.isLoading;
  }
}

export default TokenizerSingleton;
