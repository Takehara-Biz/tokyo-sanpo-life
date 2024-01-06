import { ReqLogUtil } from "../../utils/reqLogUtil";
import { CommentDoc } from "../dao/doc/commentDoc";
import { EmojiEvaluationDoc } from "../dao/doc/emojiEvaluationDoc";
import { PostDoc } from "../dao/doc/postDoc";
import { UserDoc } from "../dao/doc/userDoc";
import { PostCategory } from "../postCategory";
import { CommentDto } from "./commentDto";
import { EmojiEvaluationDto } from "./emojiEvaluationDto";
import { UserDto } from "./userDto";

/**
 * 投稿
 */
export type PostDto = {
  firestoreDocId?: string;
  user: UserDto;
  postedFirebaseUserId: string;
  photoBase64: string;
  lat: number;
  lng: number;
  postCategory: PostCategory;
  description: string;
  postComments: CommentDto[];
  emojiEvaluations: EmojiEvaluationDto[];
  insertedAt: Date;
  updatedAt: Date;
}

/**
 * Basically, Post refers User, Comments, and EmojiEvaluations.<br />
 * Hence, combine and convert to Dto.
 */
export class PostConvertor {
  public static toDto(postDoc: PostDoc, userDoc: UserDoc, commentDocs: CommentDoc[], emojiEvaluationDocs: EmojiEvaluationDoc[]): PostDto {
    const postDto : PostDto = {
      firestoreDocId: postDoc.firestoreDocId,
      user: userDoc as UserDto,
      postedFirebaseUserId: userDoc.firebaseUserId,
      photoBase64: postDoc.photoBase64,
      lat: postDoc.lat,
      lng: postDoc.lng,
      postCategory: PostCategory.findCategory(postDoc.categoryId),
      description: postDoc.description,
      postComments: commentDocs as CommentDto[],
      emojiEvaluations: emojiEvaluationDocs as EmojiEvaluationDto[],
      insertedAt: postDoc.insertedAt.toDate(),
      updatedAt: postDoc.updatedAt.toDate(),
    }
    ReqLogUtil.debug('converted result! ' + ReqLogUtil.jsonStr(postDto));
    return postDto;
  }
}