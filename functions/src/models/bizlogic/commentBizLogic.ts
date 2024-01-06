import { FirestorePostsDao } from "../dao/firestore/firestorePostsDao";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { IPostsDao } from "../dao/interface/iPostsDao";
import { ICommentsDao } from "../dao/interface/iCommentsDao";
import { CommentDto } from "../dto/commentDto";
import { FirestoreCommentsDao } from "../dao/firestore/firestoreCommentsDao";

export class CommentBizLogic {
  private commentsDao: ICommentsDao = new FirestoreCommentsDao();
  private postsDao: IPostsDao = new FirestorePostsDao();
  private static readonly MAX_COMMENTS_COUNT_PER_POST = 30;

  public async create(commentDto: CommentDto): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    const post = await this.postsDao.read(commentDto.postFirestoreDocId);
    if(post == null){
      ReqLogUtil.warn('there is no such post. post id : ' + commentDto.postFirestoreDocId);
      return false;
    }
    const countTotalComments = await this.commentsDao.countTotalComments(commentDto.postFirestoreDocId);
    if(CommentBizLogic.MAX_COMMENTS_COUNT_PER_POST <= countTotalComments){
      ReqLogUtil.warn('cannot add comment due to max count restriction.');
      return false;
    }

    commentDto.insertedAt = new Date();
    commentDto.udpatedAt = new Date();

    await this.commentsDao.create(commentDto);
    return true;
  }

  public async delete(reqParamCommentId: string): Promise<boolean> {
    if(TSLThreadLocal.currentContext.loggedInUser == undefined){
      ReqLogUtil.warn('must log in at first!');
      return false;
    }
    
    const commentDto = await this.commentsDao.read(reqParamCommentId);
    if(commentDto == null){
      ReqLogUtil.warn('there is no such comment (' + reqParamCommentId + ')');
      return false;
    }

    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    if(commentDto!.userFirestoreDocId !== firebaseUserId) {
      ReqLogUtil.warn("cannot delete other's comment!");
      ReqLogUtil.warn("identifiedFirebaseUserId : " + firebaseUserId);
      ReqLogUtil.warn("commentDto!.userFirestoreDocId : " + commentDto!.userFirestoreDocId);
      return false;
    }

    await this.commentsDao.delete(reqParamCommentId);
    return true;
  }
}
export const commentBizLogic = new CommentBizLogic();