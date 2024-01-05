import { UserDto } from "./userDto";

/**
 * Postに対するコメント
 */
export type CommentDto = {
  id: string,
  user: UserDto;
  comment: string;
  commentDate: Date;
}