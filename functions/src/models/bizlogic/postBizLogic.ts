import { geohashForLocation } from "geofire-common";
import { IEmojiEvaluationsDao } from "../dao/iEmojiEvaluationsDao";
import { IPostsDao } from "../dao/iPostsDao";
import { MockEmojiEvaluationsDao } from "../dao/mock/mockEmojiEvaluationsDao";
import { IPost } from "../serverTslDef";
import { FirestorePostsDao } from "../dao/firestore/firestorePostsDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";

export class PostBizLogic {
  //private postsDao: IPostsDao = new MockPostsDao();
  private postsDao: IPostsDao = new FirestorePostsDao();
  private emojiEvaluationsDao: IEmojiEvaluationsDao = new MockEmojiEvaluationsDao();

  public async listOrderbyCreatedDateTime(): Promise<IPost[]> {
    const result = await this.postsDao.listOrderbyCreatedDateTime(100, 0);
    //TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public async listByUserId(userId: string): Promise<IPost[]> {
    const result = await this.postsDao.listByUserId(userId);
    //TslLogUtil.info('findPostsByUserId length : ' + result.length);
    return result;
  }

  public async findPost(id: string): Promise<IPost | null> {
    const result = await this.postsDao.read(id);
    //TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public async createPost(post: IPost): Promise<void> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    post.postedFirebaseUserId = firebaseUserId!;
    //TslLogUtil.info('createPost : ' + JSON.stringify(post));
    post.geohash = geohashForLocation([post.lat, post.lng]);
    return await this.postsDao.create(post);
  }

  public async deletePost(reqParamUserId: string): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    if(reqParamUserId != firebaseUserId){
      ReqLogUtil.warn('can not delete others account!');
      return false;
    }
    await this.postsDao.delete(reqParamUserId);
    return true;
  }

  /**
   * 
   * @param postId 
   * @param userId null when not logged in.
   * @returns 
   */
  public findEmojiEvaluations(postId: string, userId: string | null): Map<string, [number, boolean]> {
    const emojiEvaluations = this.emojiEvaluationsDao.list(postId);
    const unicode_count_userPut: Map<string, [number, boolean]> = new Map<string, [number, boolean]>();

    for (let emojiEvaluation of emojiEvaluations) {
      let userPut = false;
      if (emojiEvaluation.evaluatingUserId === userId) {
        userPut = true;
      }

      if (unicode_count_userPut.has(emojiEvaluation.unicode)) {
        let count_userPut = unicode_count_userPut.get(emojiEvaluation.unicode)!;
        let currentCount = count_userPut[0];
        let existingUserPut = count_userPut[1];

        // このアルゴリズムの説明。
        // 基本的には、existingの結果を維持する。
        // ただし、これまでfalseで、今回初めてuserPutがtrueが来たら、以降はずっとtrueを維持したい。
        let newUserPut = existingUserPut;
        if (!existingUserPut && userPut) {
          newUserPut = true;
        }
        let newCount_newUserPut: [number, boolean] = [currentCount + 1, newUserPut];
        unicode_count_userPut.set(emojiEvaluation.unicode, newCount_newUserPut);
      } else {
        unicode_count_userPut.set(emojiEvaluation.unicode, [1, userPut]);
      }
    }

    return unicode_count_userPut;
  }

  public putEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void {
    this.emojiEvaluationsDao.create(postId, unicode, evaluatingUserId);
  }

  public removeEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void {
    this.emojiEvaluationsDao.delete(postId, unicode, evaluatingUserId);
  }
}
export const postLogic = new PostBizLogic();