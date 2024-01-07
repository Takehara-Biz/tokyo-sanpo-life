import { PostsColDao } from "../dao/firestore/postsColDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { IEmojiEvalsDao } from "../dao/interface/iEmojiEvalsDao";
import { EmojiEvalDto } from "../dto/emojiEvalDto";
import { EmojiEvalsSubColDao } from "../dao/firestore/post/emojiEvalsSubColDao";

export type EmojiEvalCreateResult = 'OK' | 'NG' | 'NO_SAME' | 'TOO_MANY';

export class EmojiEvalBizLogic {
  private emojiEvalsDao: IEmojiEvalsDao = new EmojiEvalsSubColDao();
  private postsDao: IPostsDao = new PostsColDao();
  
  public async create(postId: string, emojiEvalDto: EmojiEvalDto): Promise<EmojiEvalCreateResult> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return 'NG';
    }
    const post = await this.postsDao.read(postId);
    if(post == null){
      ReqLogUtil.warn('there is no such post. post id : ' + postId);
      return 'NG';
    }

    const userId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    const emojiEvalDoc = await this.emojiEvalsDao.read(postId, userId, emojiEvalDto.unicode);
    if (emojiEvalDoc !== null){
      ReqLogUtil.warn('cannot put the same emoji again!');
      return 'NO_SAME';
    }

    const count = await this.emojiEvalsDao.count(postId, userId);
    if (4 <= count){
      ReqLogUtil.warn('cannot put so many emoji!');
      return 'TOO_MANY';
    }

    emojiEvalDto.insertedAt = new Date();
    emojiEvalDto.updatedAt = new Date();

    await this.emojiEvalsDao.create(postId, emojiEvalDto);
    return 'OK';
  }

    /**
   * 
   * @param postId 
   * @param userId null when not logged in.
   * @returns 
   */
    public async findEmojiEvals(postId: string, userId: string | null): Promise<Map<string, [number, boolean]>> {
      const emojiEvals = await this.emojiEvalsDao.list(postId);
      const unicode_count_userPut: Map<string, [number, boolean]> = new Map<string, [number, boolean]>();
  
      for (let emojiEval of emojiEvals) {
        let userPut = false;
        if (emojiEval.userFirestoreDocId === userId) {
          userPut = true;
        }
  
        if (unicode_count_userPut.has(emojiEval.unicode)) {
          let count_userPut = unicode_count_userPut.get(emojiEval.unicode)!;
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
          unicode_count_userPut.set(emojiEval.unicode, newCount_newUserPut);
        } else {
          unicode_count_userPut.set(emojiEval.unicode, [1, userPut]);
        }
      }
  
      ReqLogUtil.debug('unicode_count_userPut.size : ' + unicode_count_userPut.size);
      return unicode_count_userPut;
    }

  public async read(postId: string, userId: string, reqParamEmojiEvalId: string): Promise<EmojiEvalDto | null> {
    const emojiEvalDao = await this.emojiEvalsDao.read(postId, userId, reqParamEmojiEvalId);
    if(emojiEvalDao == null){
      ReqLogUtil.warn('there is no such emojiEvalId (' + reqParamEmojiEvalId + ')');
    }
    return emojiEvalDao;
  }

  public async delete(postId: string, unicode: string): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }

    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    const emojiEvalDto = await this.emojiEvalsDao.read(postId, firebaseUserId, unicode);
    if(emojiEvalDto == null){
      ReqLogUtil.warn('there is no such emojiEval.');
      return false;
    }

    if(emojiEvalDto!.userFirestoreDocId !== firebaseUserId) {
      ReqLogUtil.warn("cannot delete other's emojiEval!");
      ReqLogUtil.warn("identifiedFirebaseUserId : " + firebaseUserId);
      ReqLogUtil.warn("emojiEvalDto!.userFirestoreDocId : " + emojiEvalDto!.userFirestoreDocId);
      return false;
    }

    await this.emojiEvalsDao.delete(postId, firebaseUserId, unicode);
    return true;
  }
}
export const emojiEvalBizLogic = new EmojiEvalBizLogic();