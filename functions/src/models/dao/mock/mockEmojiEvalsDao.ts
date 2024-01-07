import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { EmojiEvalDoc } from "../doc/post/emojiEvalsDoc";
import { IEmojiEvalsDao } from "../interface/iEmojiEvalsDao";
import { EmojiEvalDto } from "../../dto/emojiEvalDto";

export class MockEmojiEvalsDao implements IEmojiEvalsDao {
  async count(postId: string, userId: string): Promise<number> {
    return 2;
  }
  async read(postId: string, userId: string, firestoreDocId: string): Promise<EmojiEvalDto | null> {
    const emojiEvalDocs = dummyDataKeeper.createRandomEmojiEvals(1, 10, 1, 1, "1");
    return emojiEvalDocs[0];
  }
  async list(postId: string): Promise<EmojiEvalDoc[]> {
    ReqLogUtil.debug('postId: ' + postId);
    const emojiEvalDocs = dummyDataKeeper.createRandomEmojiEvals(1, 10, 0, 10, postId);
    ReqLogUtil.info('emojiEvals length : ' + emojiEvalDocs);
    return emojiEvalDocs;
  }

  async create(postId: string, emojiEvalDoc: EmojiEvalDoc): Promise<void>{
    return;
  }

  async delete(postId: string, userId:string, unicode: string): Promise<void>{
    return;
  }
}
