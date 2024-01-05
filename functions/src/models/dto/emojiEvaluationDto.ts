/**
 * Postに対する、絵文字評価
 */
export type EmojiEvaluationDto = {

  evaludatedPostId: string;
  /**
   * the type of emoji
   */
  unicode: string;

  evaluatingUserId: string;
}