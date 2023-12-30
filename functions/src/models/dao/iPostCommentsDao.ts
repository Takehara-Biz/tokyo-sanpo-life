import { IEmojiEvaluation, IPost, IPostComment } from "../serverTslDef";

export interface IPostCommentsDao {
  list(postId: string): IPostComment[];
  create(postComment: IPostComment): void;
  delete(commentId: string): void;
}
