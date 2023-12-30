import { DaoUtil } from "../dao/daoUtil";
import {PostsDao} from "../dao/postsDao";
import {IPost} from "../serverTslDef";

export class PostLogic {
  private postsDao = new PostsDao(DaoUtil.dummyUserCount);

  public findPosts(): IPost[] {
    const result = this.postsDao.findPosts();
    //TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPostsByUserId(userId: string): IPost[] {
    const result = this.postsDao.findPostsByUserId(userId);
    //TslLogUtil.info('findPostsByUserId length : ' + result.length);
    return result;
  }

  public findPost(id: string): IPost | null {
    const result = this.postsDao.findPost(id);
    //TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public createPost(post: IPost): void {
    //TslLogUtil.info('createPost : ' + JSON.stringify(post));
    return this.postsDao.createPost(post);
  }

  public deletePost(id: string): void {
    return this.postsDao.delete(id);
  }

  public findEmojiEvaluations(postId: string, userId: string): Map<string, [number, boolean]> {
    const emojiEvaluations = this.postsDao.findEmojiEvaluations(postId);
    const unicode_count_userPut : Map<string, [number, boolean]> = new Map<string, [number, boolean]>();

    for (let emojiEvaluation of emojiEvaluations) {
      let userPut = false;
      if(emojiEvaluation.evaluatingUserId == userId){
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
    this.postsDao.putEmojiEvaluation(postId, unicode, evaluatingUserId);
  }

  public removeEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
    this.postsDao.removeEmojiEvaluation(postId, unicode, evaluatingUserId);
  }
}
export const postLogic = new PostLogic();

/**
 * 絵文字評価を表示するためのクラス。
 */
export class EmojiEvaluationCount {
  constructor(
    /**
     * 絵文字の種類
     */
    private unicode: string,
    /**
     * この絵文字がつけられた数。
     */
    private count: number,
    /**
     * このユーザは、この絵文字を評価したかどうか。
     */
    private userAlreadyPut: boolean) {}

    public getUnicode(): string{
      return this.unicode;
    }
    public getCount(): number{
      return this.count;
    }
    public getUserAlreadyPut(): boolean{
      return this.userAlreadyPut;
    }
}