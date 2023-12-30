import { TslLogUtil } from "../../utils/tslLogUtil";
import { IEmojiEvaluation, IPost, IPostComment, PostCategory } from "../serverTslDef";
import { defaultUserIconBase64 } from "./defaultUserIconBase64";

/**
 * Firestoreの代わりにダミーとしてデータを保持するクラス
 */
class DummyDataKeeper {
  public readonly postCount = 3;
  public readonly userCount = 3;
  public idAndPostMap: Map<string, IPost> = new Map<string, IPost>();
  public idSequence: number = 0;
  
  constructor() {
    TslLogUtil.info('[BEGIN] PostsDao constructor');
    this.generateRandomPosts(this.postCount);
    this.idSequence = this.postCount - 1;
  }

  public nextval(): number {
    return ++this.idSequence;
  }

  private generateRandomPosts(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const commentsCount = Math.floor(Math.random() * 9)
      const comments: IPostComment[] = this.createRandomComments(commentsCount);
      const emojiEvaluations: IEmojiEvaluation[] = this.createRandomEmojiEvaluations(0, 10, 1, 50, i.toString());
      const post = {
        id: i.toString(),
        user: {
          id: i.toString(),
          userName: this.generateRandomString(3, 12),
          userIconBase64: defaultUserIconBase64,
          selfIntroduction: "",
          xProfileLink: "",
          instagramProfileLink: "",
        },
        postCategory: this.chooseContentTypeEnumRandomly(),
        imageUrl: "/images/post-sample.jpeg",
        lat: 35.2 + (Math.random()),
        lng: 139.3 + (Math.random()),
        description: this.generateRandomString(1, 100),
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
          userName: this.generateRandomString(3, 12),
          userIconBase64: defaultUserIconBase64,
          selfIntroduction: "",
          xProfileLink: "",
          instagramProfileLink: "",
        },
        comment: this.generateRandomString(1, 100),
        commentDate: new Date("2023/12/01"),
      },);
    }
    return comments;
  }

  private createRandomEmojiEvaluations(minTypeCount: number, maxTypeCount: number, minTotalCount: number, maxTotalCount: number, postId: string): IEmojiEvaluation[] {
    const evaluations: IEmojiEvaluation[] = [];
    const typeCount = this.generateRandomNumber(minTypeCount, maxTypeCount);
    if(minTotalCount < 1){
      minTotalCount  = 1;
    }
    
    const uniqueEmojis = this.generateUniqueRandomEmojis(typeCount);
    
    for (let i = 0; i < uniqueEmojis.length; i++) {
      const totalCount = this.generateRandomNumber(minTotalCount, maxTotalCount);
      for(let j = 0; j < totalCount; j++){
        evaluations.push({
          evaludatedPostId: postId,
          unicode: uniqueEmojis[i],
          evaluatingUserId: j.toString(),
        },);
      }
    }
    return evaluations;
  }

  private generateUniqueRandomEmojis(count: number): string[] {
    const start = 0x1f600;
    const end = 0x1f64f;
    const range = end - start;
    
    const unicodes: string[] = [];
    while(unicodes.length < count){
      const code = Math.floor(Math.random() * range) + start;
      const unicode = String.fromCodePoint(code);
      if(unicodes.includes(unicode)){
        continue;
      } else {
        unicodes.push(unicode);
      }
    }
    return unicodes;
  }

  private chooseContentTypeEnumRandomly(): PostCategory {
    const index = Math.floor(Math.random() * PostCategory.Categories.length);
    return PostCategory.Categories[index];
  }

  public generateRandomString(charMinCount: number, charMaxCount: number): string {
    const useChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strLength = Math.floor(Math.random() * (charMaxCount - charMinCount)) + charMinCount;
    let result = "";
    for (let i = 0; i < strLength; i++) {
      result += useChar.charAt(Math.floor(Math.random() * useChar.length));
    }
    return result;
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
export const dummyDataKeeper = new DummyDataKeeper();