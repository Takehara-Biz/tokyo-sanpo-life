import { FirestorePostsDao } from "../dao/firestore/firestorePostsDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { IEmojiEvalsDao } from "../dao/interface/iEmojiEvalsDao";
import { FirestoreEmojiEvalsDao } from "../dao/firestore/firestoreEmojiEvalsDao";
import { EmojiEvalDto } from "../dto/emojiEvalDto";

export class EmojiEvalBizLogic {
  private emojiEvalsDao: IEmojiEvalsDao = new FirestoreEmojiEvalsDao();
  private postsDao: IPostsDao = new FirestorePostsDao();

  public async create(emojiEvalDto: EmojiEvalDto): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    const post = await this.postsDao.read(emojiEvalDto.postFirestoreDocId);
    if(post == null){
      ReqLogUtil.warn('there is no such post. post id : ' + emojiEvalDto.postFirestoreDocId);
      return false;
    }

    emojiEvalDto.insertedAt = new Date();
    emojiEvalDto.updatedAt = new Date();

    await this.emojiEvalsDao.create(emojiEvalDto);
    return true;
  }

  public async read(reqParamEmojiEvalId: string): Promise<EmojiEvalDto | null> {
    const emojiEvalDao = await this.emojiEvalsDao.read(reqParamEmojiEvalId);
    if(emojiEvalDao == null){
      ReqLogUtil.warn('there is no such emojiEvalId (' + reqParamEmojiEvalId + ')');
    }
    return emojiEvalDao;
  }

  public async delete(reqParamEmojiEvalId: string): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    
    const emojiEvalDto = await this.emojiEvalsDao.read(reqParamEmojiEvalId);
    if(emojiEvalDto == null){
      ReqLogUtil.warn('there is no such emojiEvalId (' + reqParamEmojiEvalId + ')');
      return false;
    }

    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    if(emojiEvalDto!.userFirestoreDocId !== firebaseUserId) {
      ReqLogUtil.warn("cannot delete other's emojiEval!");
      ReqLogUtil.warn("identifiedFirebaseUserId : " + firebaseUserId);
      ReqLogUtil.warn("emojiEvalDto!.userFirestoreDocId : " + emojiEvalDto!.userFirestoreDocId);
      return false;
    }

    await this.emojiEvalsDao.delete(reqParamEmojiEvalId);
    return true;
  }
}
export const emojiEvalBizLogic = new EmojiEvalBizLogic();