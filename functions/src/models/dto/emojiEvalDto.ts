/**
 * Postに対する、絵文字評価
 */
export type EmojiEvalDto = {
  firestoreDocId?: string;
  userFirestoreDocId: string;
  /**
   * the type of emoji
   */
  unicode: string;
  insertedAt: Date;
  updatedAt: Date;
}