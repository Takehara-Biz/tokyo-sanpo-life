import { EmojiEvalDoc } from "../doc/emojiEvalsDoc";

export interface IEmojiEvalsDao {
  read(firestoreDocId: string): Promise<EmojiEvalDoc | null>
  list(postId: string): Promise<EmojiEvalDoc[]>;
  /**
   * even if there is already an evaluation which meets the param, it is OK. just do nothing.
   */
  create(emojiEvaluationDoc: EmojiEvalDoc): Promise<void>;
  /**
   * even if there is no evaluation which meets the param, it is OK. just do nothing.
   */
  delete(firestoreDocId: string): Promise<void>;
}
