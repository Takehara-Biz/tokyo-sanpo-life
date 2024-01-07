import { geohashForLocation } from "geofire-common";
import { PostCategory } from "../../postCategory";
import { PostDoc } from "../doc/postDoc";
import { EmojiEvalDoc } from "../doc/post/emojiEvalsDoc";
import { BasicUserIconUtil } from "../basicUserIconBase64";
import { Timestamp } from "firebase-admin/firestore";
import { CommentDoc } from "../doc/commentDoc";
import { UserDoc } from "../doc/userDoc";

/**
 * Firestoreの代わりにダミーとしてデータを保持するクラス
 */
class DummyDataKeeper {
  public readonly postCount = 3;
  public readonly userCount = 3;
  public idAndPostMap: Map<string, PostDoc> = new Map<string, PostDoc>();
  public idSequence: number = 0;
  public idAndUserMap: Map<string, UserDoc> = new Map<string, UserDoc>();
  
  constructor() {
    this.generateRandomPosts(this.postCount);
    this.idSequence = this.postCount - 1;
    this.generateRandomUsers(this.userCount);
  }

  public nextval(): number {
    return ++this.idSequence;
  }

  private generateRandomUsers(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const now = new Date();
      const user = {
        firebaseUserId: i.toString(),
        loggedIn: true,
        userName: DummyDataKeeper.generateRandomString(3, 12),
        userIconBase64: BasicUserIconUtil.defaultUserIconBase64,
        selfIntroduction: "こんにちは〜。" + DummyDataKeeper.generateRandomString(1, 50),
        xProfileLink: "https://www.yahoo.co.jp",
        instagramProfileLink: "https://www.yahoo.co.jp",
        insertedAt: now,
        updatedAt: now,
      };
      this.idAndUserMap.set(i.toString(), user);
    }
  }

  private generateRandomPosts(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const now = Timestamp.now();
      const lat = 35.2 + Math.random();
      const lng = 139.3 + Math.random();

      const post : PostDoc = {
        firestoreDocId: i.toString(),
        postedFirebaseUserId: i.toString(),
        photoUrl: DummyDataKeeper.dummyPhotoUrl,
        lat: lat,
        lng: lng,
        /**
         * for easy search.
         * https://firebase.google.com/docs/firestore/solutions/geoqueries?hl=ja#solution_geohashes
         */
        geohash: geohashForLocation([lat, lng]),
        categoryId: this.chooseContentTypeEnumRandomly().getId(),
        description: DummyDataKeeper.generateRandomString(1, 100),
        insertedAt: now,
        updatedAt: now,
      };
      this.idAndPostMap.set(i.toString(), post);
    }
  }

  public createRandomComments(count: number): CommentDoc[] {
    const comments: CommentDoc[] = [];
    for (let i = 0; i < count; i++) {
      const now = new Date();
      comments.push({
        firestoreDocId: i.toString(),
        postFirestoreDocId: i.toString(),
        userFirestoreDocId: i.toString(),
        comment: DummyDataKeeper.generateRandomString(1, 100),
        insertedAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
      },);
    }
    return comments;
  }

  public createRandomEmojiEvals(minTypeCount: number, maxTypeCount: number, minTotalCount: number, maxTotalCount: number, postId: string): EmojiEvalDoc[] {
    const evaluations: EmojiEvalDoc[] = [];
    const typeCount = DummyDataKeeper.generateRandomNumber(minTypeCount, maxTypeCount);
    if(minTotalCount < 1){
      minTotalCount  = 1;
    }
    
    const uniqueEmojis = this.generateUniqueRandomEmojis(typeCount);
    
    for (let i = 0; i < uniqueEmojis.length; i++) {
      const totalCount = DummyDataKeeper.generateRandomNumber(minTotalCount, maxTotalCount);
      for(let j = 0; j < totalCount; j++){
        const now = new Date();
        evaluations.push({
          unicode: uniqueEmojis[i],
          userFirestoreDocId: j.toString(),
          insertedAt: now,
          updatedAt: now
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

  public static generateRandomString(charMinCount: number, charMaxCount: number): string {
    const useChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const strLength = Math.floor(Math.random() * (charMaxCount - charMinCount)) + charMinCount;
    let result = "";
    for (let i = 0; i < strLength; i++) {
      result += useChar.charAt(Math.floor(Math.random() * useChar.length));
    }
    return result;
  }

  private static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private static dummyPhotoUrl = "/images/dummy-photo.jpg" 
}
export const dummyDataKeeper = new DummyDataKeeper();