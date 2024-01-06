import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { CommentDto } from "../../dto/commentDto";
import { CommentDoc } from "../doc/commentDoc";
import { ICommentsDao } from "../interface/iCommentsDao";
import { dummyDataKeeper } from "./dummyDataKeeper";

export class MockCommentsDao implements ICommentsDao{
  async read(commentId: string): Promise<CommentDto | null> {
    const commentsDocs = dummyDataKeeper.createRandomComments(1);
    return commentsDocs[0];
  }
  async listOrderbyInsertedAtAsc(postId: string): Promise<CommentDoc[]> {
    ReqLogUtil.debug('postId: ' + postId);
    const commentsDocs = dummyDataKeeper.createRandomComments(5);
    ReqLogUtil.info('commentsDocs length : ' + commentsDocs.length);
    return commentsDocs;
  }

  async countTotalComments(postId: string): Promise<number>{
    return 3;
  }

  async create(commentDoc: CommentDoc): Promise<void>{
    return;
  }

  async delete(commentFirestoreDocId: string): Promise<void>{
    return;
  }
}
