import { PostsColDao } from "../dao/firestore/postsColDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { IEmojiEvalsDao } from "../dao/interface/iEmojiEvalsDao";
import { EmojiEvalDto } from "../dto/emojiEvalDto";
import { EmojiEvalsSubColDao } from "../dao/firestore/post/emojiEvalsSubColDao";

export class EmojiEvalBizLogic {
  private emojiEvalsDao: IEmojiEvalsDao = new EmojiEvalsSubColDao();
  private postsDao: IPostsDao = new PostsColDao();

  public async create(postId: string, emojiEvalDto: EmojiEvalDto): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    const post = await this.postsDao.read(postId);
    if(post == null){
      ReqLogUtil.warn('there is no such post. post id : ' + postId);
      return false;
    }

    emojiEvalDto.insertedAt = new Date();
    emojiEvalDto.updatedAt = new Date();

    await this.emojiEvalsDao.create(postId, emojiEvalDto);
    return true;
  }

  public async read(postId: string, reqParamEmojiEvalId: string): Promise<EmojiEvalDto | null> {
    const emojiEvalDao = await this.emojiEvalsDao.read(postId, reqParamEmojiEvalId);
    if(emojiEvalDao == null){
      ReqLogUtil.warn('there is no such emojiEvalId (' + reqParamEmojiEvalId + ')');
    }
    return emojiEvalDao;
  }

  public async delete(postId: string, reqParamEmojiEvalId: string): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    
    const emojiEvalDto = await this.emojiEvalsDao.read(postId, reqParamEmojiEvalId);
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

    await this.emojiEvalsDao.delete(postId, reqParamEmojiEvalId);
    return true;
  }
}
export const emojiEvalBizLogic = new EmojiEvalBizLogic();