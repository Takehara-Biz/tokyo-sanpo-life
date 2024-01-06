import { EmojiEvaluationDoc } from "../doc/emojiEvaluationDoc";

export interface IEmojiEvaluationsDao {
  list(postId: string): EmojiEvaluationDoc[];
  /**
   * even if there is already an evaluation which meets the param, it is OK. just do nothing.
   * @param postId 
   * @param unicode 
   * @param evaluatingUserId 
   * @returns 
   */
  create(postId: string, unicode: string, evaluatingUserId: string): void;
  /**
   * even if there is no evaluation which meets the param, it is OK. just do nothing.
   * @param postId 
   * @param unicode 
   * @param evaluatingUserId 
   */
  delete(postId: string, unicode: string, evaluatingUserId: string): void;
}