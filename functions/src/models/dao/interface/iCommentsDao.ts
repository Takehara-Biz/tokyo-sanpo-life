import { CommentDoc } from "../doc/commentDoc";

export interface ICommentsDao {
  create(commentDoc: CommentDoc): Promise<void>;
  read(commentId: string): Promise<CommentDoc | null>;
  listOrderbyInsertedAtAsc(postId: string): Promise<CommentDoc[]>;
  countTotalComments(postId: string): Promise<number>;
  delete(commentFirestoreDocId: string): Promise<void>;
}
