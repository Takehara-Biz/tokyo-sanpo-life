import { CommentDto } from "../../dto/commentDto";

export interface ICommentsDao {
  list(postId: string): Promise<CommentDto[]>;
  create(postComment: CommentDto): Promise<void>;
  delete(commentId: string): Promise<void>;
}
