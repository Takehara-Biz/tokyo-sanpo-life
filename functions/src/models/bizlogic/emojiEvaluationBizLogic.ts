import { FirestorePostsDao } from "../dao/firestore/firestorePostsDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { IEmojiEvaluationsDao } from "../dao/interface/iEmojiEvaluationsDao";
import { FirestoreEmojiEvaluationsDao } from "../dao/firestore/firestoreEmojiEvaluationsDao";
import { EmojiEvaluationDto } from "../dto/emojiEvaluationDto";

export class EmojiEvaluationBizLogic {
  private emojiEvaluationDao: IEmojiEvaluationsDao = new FirestoreEmojiEvaluationsDao();
  private postsDao: IPostsDao = new FirestorePostsDao();

  public async create(emojiEvaluationDto: EmojiEvaluationDto): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    const post = await this.postsDao.read(emojiEvaluationDto.postFirestoreDocId);
    if(post == null){
      ReqLogUtil.warn('there is no such post. post id : ' + emojiEvaluationDto.postFirestoreDocId);
      return false;
    }

    emojiEvaluationDto.insertedAt = new Date();
    emojiEvaluationDto.updatedAt = new Date();

    await this.emojiEvaluationDao.create(emojiEvaluationDto);
    return true;
  }

  public async delete(reqParamEmojiEvaluationId: string): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    
    const commentDto = await this.emojiEvaluationDao.read(reqParamEmojiEvaluationId);
    if(commentDto == null){
      ReqLogUtil.warn('there is no such emojiEvaluationId (' + reqParamEmojiEvaluationId + ')');
      return false;
    }

    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    if(commentDto!.userFirestoreDocId !== firebaseUserId) {
      ReqLogUtil.warn("cannot delete other's comment!");
      ReqLogUtil.warn("identifiedFirebaseUserId : " + firebaseUserId);
      ReqLogUtil.warn("commentDto!.userFirestoreDocId : " + commentDto!.userFirestoreDocId);
      return false;
    }

    await this.emojiEvaluationDao.delete(reqParamEmojiEvaluationId);
    return true;
  }
}
export const emojiEvaluationBizLogic = new EmojiEvaluationBizLogic();