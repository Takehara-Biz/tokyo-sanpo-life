import { TslLogUtil } from "../../utils/tslLogUtil";
import {IEmojiEvaluation, IPost, IPostComment, PostCategory} from "../serverTslDef";
import { DaoUtil } from "./daoUtil";
import { defaultUserIconBase64 } from "./defaultUserIconBase64";

export class PostsDao {
  private idAndPostMap: Map<string, IPost> = new Map<string, IPost>();
  private idSequence: number;

  constructor(postCount: number) {
    this.generateRandomPosts(postCount);
    this.idSequence = postCount - 1;
  }

  private generateRandomPosts(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const commentsCount = Math.floor(Math.random() * 9)
      const comments: IPostComment[] = this.createRandomComments(commentsCount);
      const emojiEvaluations: IEmojiEvaluation[] = this.createRandomEmojiEvaluations(commentsCount * 4, i.toString());
      const post = {
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: DaoUtil.generateRandomString(3, 12),
          userIconBase64: defaultUserIconBase64,
          selfIntroduction: "",
          twitterProfileLink: "",
          instagramProfileLink: "",
        },
        postCategory: this.chooseContentTypeEnumRandomly(),
        imageUrl: "/images/post-sample.jpeg",
        lat: 35.2 + (Math.random()),
        lng: 139.3 + (Math.random()),
        description: DaoUtil.generateRandomString(1, 100),
        insertDate: new Date("2023/12/01"),
        postComments: comments,
        emojiEvaluations : emojiEvaluations
      };
      this.idAndPostMap.set(i.toString(), post);
    }
  }

  private createRandomComments(count: number): IPostComment[] {
    const comments: IPostComment[] = [];
    for (let i = 0; i < count; i++) {
      comments.push({
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: DaoUtil.generateRandomString(3, 12),
          userIconBase64: defaultUserIconBase64,
          selfIntroduction: "",
          twitterProfileLink: "",
          instagramProfileLink: "",
        },
        comment: DaoUtil.generateRandomString(1, 100),
        commentDate: new Date("2023/12/01"),
      },);
    }
    return comments;
  }

  private createRandomEmojiEvaluations(count: number, postId: string): IEmojiEvaluation[] {
    const evaluations: IEmojiEvaluation[] = [];
    
    for (let i = 0; i < count; i++) {
      const evaluatingUserId = DaoUtil.generateRandomNumber(0, DaoUtil.dummyUserCount);
      evaluations.push({
        evaludatedPostId: postId,
        unicode: this.generateRandomEmoji(),
        evaluatingUserId: evaluatingUserId.toString()
      },);
    }
    return evaluations;
  }

  private generateRandomEmoji(): string {
    const start = 0x1f600;
    const end = 0x1f64f;
    const range = end - start;
    const code = Math.floor(Math.random() * range) + start;
    return String.fromCodePoint(code);
  }

  private chooseContentTypeEnumRandomly(): PostCategory {
    const index = Math.floor(Math.random() * PostCategory.Categories.length);
    return PostCategory.Categories[index];
  }

  private nextval(): number {
    return ++this.idSequence;
  }

  public findPosts(): IPost[] {
    const result = [...this.idAndPostMap.values()]
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPostsByUserId(userId: string): IPost[] {
    const result = [...this.idAndPostMap.values()].filter((value: IPost) => value.user.id === userId);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPost(id: string): IPost | null {
    const result = this.idAndPostMap.get(id) ?? null;
    TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public createPost(post: IPost):void {
    post.id = this.nextval().toString();
    TslLogUtil.info('createPost : ' + JSON.stringify(post));
    this.idAndPostMap.set(post.id, post);
  }

  public delete(id: string):void {
    const result = this.idAndPostMap.delete(id);
    TslLogUtil.info('deleted post ' + id + ', and the result is ' + result);
  }

  public findEmojiEvaluations(postId: string): IEmojiEvaluation[] {
    TslLogUtil.debug('postId: ' + postId);
    const post = this.idAndPostMap.get(postId);
    TslLogUtil.info('emojiEvaluations length : ' + post!.emojiEvaluations.length);
    return post!.emojiEvaluations;
  }
}
