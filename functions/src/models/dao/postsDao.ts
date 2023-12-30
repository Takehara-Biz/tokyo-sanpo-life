import { TslLogUtil } from "../../utils/tslLogUtil";
import {IEmojiEvaluation, IPost} from "../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";

export class PostsDao {

  public findPosts(): IPost[] {
    const result = [...dummyDataKeeper.idAndPostMap.values()]
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPostsByUserId(userId: string): IPost[] {
    const result = [...dummyDataKeeper.idAndPostMap.values()].filter((value: IPost) => value.user.id === userId);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPost(id: string): IPost | null {
    const result = dummyDataKeeper.idAndPostMap.get(id) ?? null;
    TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public createPost(post: IPost):void {
    post.id = dummyDataKeeper.nextval().toString();
    TslLogUtil.info('createPost : ' + JSON.stringify(post));
    dummyDataKeeper.idAndPostMap.set(post.id, post);
  }

  public delete(id: string):void {
    const result = dummyDataKeeper.idAndPostMap.delete(id);
    TslLogUtil.info('deleted post ' + id + ', and the result is ' + result);
  }

  public findEmojiEvaluations(postId: string): IEmojiEvaluation[] {
    TslLogUtil.debug('postId: ' + postId);
    const post = dummyDataKeeper.idAndPostMap.get(postId);
    TslLogUtil.info('emojiEvaluations length : ' + post!.emojiEvaluations.length);
    return post!.emojiEvaluations;
  }

  /**
   * even if there is already an evaluation which meets the param, it is OK. just do nothing.
   * @param postId 
   * @param unicode 
   * @param evaluatingUserId 
   * @returns 
   */
  public putEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
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

  /**
   * even if there is no evaluation which meets the param, it is OK. just do nothing.
   * @param postId 
   * @param unicode 
   * @param evaluatingUserId 
   */
  public removeEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
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
