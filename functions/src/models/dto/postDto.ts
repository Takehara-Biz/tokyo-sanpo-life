import { PostCategory } from "../postCategory";
import { CommentDto } from "./commentDto";
import { EmojiEvalDto } from "./emojiEvalDto";
import { UserDto } from "./userDto";

/**
 * 投稿
 */
export type PostDto = {
  firestoreDocId?: string;
  user: UserDto;
  postedFirebaseUserId: string;
  photoUrl: string;
  lat: number;
  lng: number;
  postCategory: PostCategory;
  description: string;
  postComments: CommentDto[];
  emojiEvals: EmojiEvalDto[];
  insertedAt: Date;
  updatedAt: Date;
}