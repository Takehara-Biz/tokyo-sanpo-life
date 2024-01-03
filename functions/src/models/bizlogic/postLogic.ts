import { IEmojiEvaluationsDao } from "../dao/iEmojiEvaluationsDao";
import { IPostsDao } from "../dao/iPostsDao";
import { MockEmojiEvaluationsDao } from "../dao/mockEmojiEvaluationsDao";
import {MockPostsDao} from "../dao/mockPostsDao";
import {IPost} from "../serverTslDef";

export class PostLogic {
  private postsDao: IPostsDao = new MockPostsDao();
  private emojiEvaluationsDao: IEmojiEvaluationsDao = new MockEmojiEvaluationsDao();

  public findPosts(): IPost[] {
    const result = this.postsDao.listOrderbyCreatedDateTime(100, 0);
    //TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPostsByUserId(userId: string): IPost[] {
    const result = this.postsDao.listByUserId(userId);
    //TslLogUtil.info('findPostsByUserId length : ' + result.length);
    return result;
  }

  public findPost(id: string): IPost | null {
    const result = this.postsDao.read(id);
    //TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public createPost(post: IPost): void {
    //TslLogUtil.info('createPost : ' + JSON.stringify(post));
    return this.postsDao.create(post);
  }

  public deletePost(id: string): void {
    return this.postsDao.delete(id);
  }

  /**
   * 
   * @param postId 
   * @param userId null when not logged in.
   * @returns 
   */
  public findEmojiEvaluations(postId: string, userId: string | null): Map<string, [number, boolean]> {
    const emojiEvaluations = this.emojiEvaluationsDao.list(postId);
    const unicode_count_userPut : Map<string, [number, boolean]> = new Map<string, [number, boolean]>();

    for (let emojiEvaluation of emojiEvaluations) {
      let userPut = false;
      if(emojiEvaluation.evaluatingUserId === userId){
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
        if(!existingUserPut && userPut){
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

  public putEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
    this.emojiEvaluationsDao.create(postId, unicode, evaluatingUserId);
  }

  public removeEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
    this.emojiEvaluationsDao.delete(postId, unicode, evaluatingUserId);
  }
}
export const postLogic = new PostLogic();