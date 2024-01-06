import { UserDto } from "./userDto";

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
  userDto?: UserDto;
  comment: string;
  insertedAt: Date;
  udpatedAt: Date;
}