import { EmojiEvalDoc } from "../doc/post/emojiEvalsDoc";

export interface IEmojiEvalsDao {
  /**
   * be used for duplication check
   */
  read(postId: string, userId:string, unicode: string): Promise<EmojiEvalDoc | null>;
  /**
   * be used to check too many evaluation
   */
  count(postId: string, userId:string): Promise<number>;
  /**
   * even if there is already an evaluation which meets the param, it is OK. just do nothing.
   */
  create(postId: string, emojiEvaluationDoc: EmojiEvalDoc): Promise<void>;
  list(postId: string): Promise<EmojiEvalDoc[]>;
  /**
   * even if there is no evaluation which meets the param, it is OK. just do nothing.
   */
  delete(postId: string, userId: string, firestoreDocId: string): Promise<void>;
}
