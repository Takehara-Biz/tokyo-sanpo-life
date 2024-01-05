import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { CommentDto } from "../../dto/commentDto";
import { CommentDoc } from "../doc/commentDoc";
import { ICommentsDao } from "../interface/iCommentsDao";
import { dummyDataKeeper } from "./dummyDataKeeper";

export class MockCommentsDao implements ICommentsDao{
  public async list(postId: string): Promise<CommentDoc[]> {
    ReqLogUtil.debug('postId: ' + postId);
    const commentsDocs = dummyDataKeeper.createRandomComments(5);
    ReqLogUtil.info('commentsDocs length : ' + commentsDocs.length);
    return commentsDocs;
  }

  public async create(postComment: CommentDto): Promise<void>{
    return;
  }

  public async delete(commentId: string): Promise<void>{
    return;
  }
}
