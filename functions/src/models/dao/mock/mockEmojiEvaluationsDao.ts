import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { EmojiEvaluationDoc } from "../doc/emojiEvaluationDoc";
import { IEmojiEvaluationsDao } from "../interface/iEmojiEvaluationsDao";

export class MockEmojiEvaluationsDao implements IEmojiEvaluationsDao {
  list(postId: string): EmojiEvaluationDoc[] {
    ReqLogUtil.debug('postId: ' + postId);
    const emojiEvaluationDocs = dummyDataKeeper.createRandomEmojiEvaluations(1, 10, 0, 10, postId);
    ReqLogUtil.info('emojiEvaluations length : ' + emojiEvaluationDocs);
    return emojiEvaluationDocs;
  }

  create(postId: string, unicode: string, evaluatingUserId: string): void{
    return;
  }

  delete(postId: string, unicode: string, evaluatingUserId: string): void{
    return;
  }
}
