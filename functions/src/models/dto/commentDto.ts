/**
 * A comment for a post.
 */
export type CommentDto = {
  firestoreDocId?: string;
  postFirestoreDocId: string;
  userFirestoreDocId: string;
  /**
   * コメント一覧表示時に、ユーザ名とユーザアイコンの表示が必要。
   */
  commentUserDto?: CommentUserDto;
  comment: string;
  insertedAt: Date;
  updatedAt: Date;
}

/**
 * Necessary user info related to Comment.
 */
export type CommentUserDto = {
  firebaseUserId: string,
  userName: string;
  userIconBase64: string;
}