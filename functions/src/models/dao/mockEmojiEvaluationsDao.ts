import { TslLogUtil } from "../../utils/tslLogUtil";
import { IEmojiEvaluation } from "../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { IEmojiEvaluationsDao } from "./iEmojiEvaluationsDao";

export class MockEmojiEvaluationsDao implements IEmojiEvaluationsDao {
  public list(postId: string): IEmojiEvaluation[] {
    TslLogUtil.debug('postId: ' + postId);
    const post = dummyDataKeeper.idAndPostMap.get(postId);
    TslLogUtil.info('emojiEvaluations length : ' + post!.emojiEvaluations.length);
    return post!.emojiEvaluations;
  }

  public create(postId: string, unicode: string, evaluatingUserId: string): void{
    const post = dummyDataKeeper.idAndPostMap.get(postId);
    for(let emojiEvaluation of post!.emojiEvaluations) {
      if(emojiEvaluation.evaluatingUserId == evaluatingUserId && emojiEvaluation.unicode == unicode){
        TslLogUtil.info("do nothing, but it's OK.");
        return;
      }
    }

    post!.emojiEvaluations.push({evaludatedPostId: postId, unicode: unicode, evaluatingUserId: evaluatingUserId});
    TslLogUtil.info("did put!" + unicode);
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
      TslLogUtil.info('deleted!');
    } else {
      TslLogUtil.info("do nothing, but it's OK.");
    }
  }
}
