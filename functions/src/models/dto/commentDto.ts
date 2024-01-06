/**
 * A comment for a post.
 */
export type CommentDto = {
  firestoreDocId?: string;
  postFirestoreDocId: string;
  userFirestoreDocId: string;
  comment: string;
  insertedAt: Date;
  udpatedAt: Date;
}