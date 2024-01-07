import { CommentDoc } from "../dao/doc/commentDoc";
import { EmojiEvalDoc } from "../dao/doc/post/emojiEvalsDoc";
import { PostDoc } from "../dao/doc/postDoc";
import { UserDoc } from "../dao/doc/userDoc";
import { PostCategory } from "../postCategory";
import { CommentDto } from "./commentDto";
import { EmojiEvalDto } from "./emojiEvalDto";
import { PostDto } from "./postDto";
import { UserDto } from "./userDto";

/**
 * Basically, Post refers User, Comments, and EmojiEvaluations.<br />
 * Hence, combine and convert to Dto.
 */
export class DocDtoConvertor {
  public static toPostDto(postDoc: PostDoc, userDoc: UserDoc, commentDtos: CommentDto[], emojiEvalDocs: EmojiEvalDoc[]): PostDto {
    const postDto : PostDto = {
      firestoreDocId: postDoc.firestoreDocId,
      user: userDoc as UserDto,
      postedFirebaseUserId: userDoc.firebaseUserId,
      photoUrl: postDoc.photoUrl!,
      lat: postDoc.lat,
      lng: postDoc.lng,
      postCategory: PostCategory.findCategory(postDoc.categoryId),
      description: postDoc.description,
      postComments: commentDtos,
      emojiEvals: emojiEvalDocs as EmojiEvalDto[],
      insertedAt: postDoc.insertedAt.toDate(),
      updatedAt: postDoc.updatedAt.toDate(),
    }
    //ReqLogUtil.debug('converted result! ' + ReqLogUtil.jsonStr(postDto));
    return postDto;
  }
  public static toCommentDto(commentDoc: CommentDoc, userDoc: UserDoc): CommentDto {
    const commentDto : CommentDto = {
      firestoreDocId: commentDoc.firestoreDocId,
      postFirestoreDocId: commentDoc.postFirestoreDocId,
      userFirestoreDocId: commentDoc.userFirestoreDocId,
      /**
       * コメント一覧表示時に、ユーザ名とユーザアイコンの表示が必要。
       */
      commentUserDto: {
        firebaseUserId: userDoc.firebaseUserId,
        userName: userDoc.userName,
        userIconBase64: userDoc.userIconBase64,
      },
      comment: commentDoc.comment,
      insertedAt: commentDoc.insertedAt.toDate(),
      updatedAt: commentDoc.updatedAt.toDate(),
    }
    //ReqLogUtil.debug('converted result! ' + ReqLogUtil.jsonStr(commentDto));
    return commentDto;
  }
}