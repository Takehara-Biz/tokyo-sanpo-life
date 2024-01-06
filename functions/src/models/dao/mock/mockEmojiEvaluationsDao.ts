import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { EmojiEvaluationDoc } from "../doc/emojiEvaluationDoc";
import { IEmojiEvaluationsDao } from "../interface/iEmojiEvaluationsDao";
import { EmojiEvaluationDto } from "../../dto/emojiEvaluationDto";

export class MockEmojiEvaluationsDao implements IEmojiEvaluationsDao {
  async read(firestoreDocId: string): Promise<EmojiEvaluationDto | null> {
    const emojiEvaluationDocs = dummyDataKeeper.createRandomEmojiEvaluations(1, 10, 1, 1, "1");
    return emojiEvaluationDocs[0];
  }
  async list(postId: string): Promise<EmojiEvaluationDoc[]> {
    ReqLogUtil.debug('postId: ' + postId);
    const emojiEvaluationDocs = dummyDataKeeper.createRandomEmojiEvaluations(1, 10, 0, 10, postId);
    ReqLogUtil.info('emojiEvaluations length : ' + emojiEvaluationDocs);
    return emojiEvaluationDocs;
  }

  async create(emojiEvaluationDoc: EmojiEvaluationDoc): Promise<void>{
    return;
  }

  async delete(firestoreDocId: string): Promise<void>{
    return;
  }
}
