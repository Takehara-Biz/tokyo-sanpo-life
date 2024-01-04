import { ReqLogUtil } from "../../utils/reqLogUtil";
import { IEmojiEvaluation } from "../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { IEmojiEvaluationsDao } from "./iEmojiEvaluationsDao";

export class MockEmojiEvaluationsDao implements IEmojiEvaluationsDao {
  public list(postId: string): IEmojiEvaluation[] {
    ReqLogUtil.debug('postId: ' + postId);
    const post = dummyDataKeeper.idAndPostMap.get(postId);
    ReqLogUtil.info('emojiEvaluations length : ' + post!.emojiEvaluations.length);
    return post!.emojiEvaluations;
  }

  public create(postId: string, unicode: string, evaluatingUserId: string): void{
    const post = dummyDataKeeper.idAndPostMap.get(postId);
    for(let emojiEvaluation of post!.emojiEvaluations) {
      if(emojiEvaluation.evaluatingUserId == evaluatingUserId && emojiEvaluation.unicode == unicode){
        ReqLogUtil.info("do nothing, but it's OK.");
        return;
      }
    }

    post!.emojiEvaluations.push({evaludatedPostId: postId, unicode: unicode, evaluatingUserId: evaluatingUserId});
    ReqLogUtil.info("did put!" + unicode);
  }

  public delete(postId: string, unicode: string, evaluatingUserId: string): void{
    const post = dummyDataKeeper.idAndPostMap.get(postId);
    const beforeCount = post!.emojiEvaluations.length;
    post!.emojiEvaluations = post!.emojiEvaluations.filter((item) => 
      item.evaluatingUserId != evaluatingUserId &&
      item.unicode != unicode &&
      item.evaludatedPostId != postId
    );
    if(beforeCount != post!.emojiEvaluations.length){
      ReqLogUtil.info('deleted!');
    } else {
      ReqLogUtil.info("do nothing, but it's OK.");
    }
  }
}
