import { EmojiEvaluationDoc } from "../doc/emojiEvaluationDoc";

export interface IEmojiEvaluationsDao {
  read(firestoreDocId: string): Promise<EmojiEvaluationDoc | null>
  list(postId: string): Promise<EmojiEvaluationDoc[]>;
  /**
   * even if there is already an evaluation which meets the param, it is OK. just do nothing.
   */
  create(emojiEvaluationDoc: EmojiEvaluationDoc): Promise<void>;
  /**
   * even if there is no evaluation which meets the param, it is OK. just do nothing.
   */
  delete(firestoreDocId: string): Promise<void>;
}
