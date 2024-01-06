/**
 * Postに対する、絵文字評価
 */
export type EmojiEvaluationDto = {
  firestoreDocId?: string;
  postFirestoreDocId: string;
  userFirestoreDocId: string;
  /**
   * the type of emoji
   */
  unicode: string;
  insertedAt: Date;
  updatedAt: Date;
}