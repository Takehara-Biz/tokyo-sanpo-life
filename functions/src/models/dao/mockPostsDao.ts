import { TslLogUtil } from "../../utils/tslLogUtil";
import {IEmojiEvaluation, IPost} from "../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { IPostsDao } from "./iPostsDao";

export class MockPostsDao implements IPostsDao {

  public listOrderbyCreatedDateTime(limit: number, offset: number): IPost[] {
    const result = [...dummyDataKeeper.idAndPostMap.values()].slice(0, limit);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public listByGeoQuery(lat: number, lng: number, distanceKM: number): IPost[] {
    const result = [...dummyDataKeeper.idAndPostMap.values()].slice(0, 50);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public listByUserId(userId: string): IPost[] {
    const result = [...dummyDataKeeper.idAndPostMap.values()].filter((value: IPost) => value.user.id === userId);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public read(postId: string): IPost | null {
    const result = dummyDataKeeper.idAndPostMap.get(postId) ?? null;
    TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public create(post: IPost):void {
    post.id = dummyDataKeeper.nextval().toString();
    TslLogUtil.info('createPost : ' + JSON.stringify(post));
    dummyDataKeeper.idAndPostMap.set(post.id, post);
  }

  public delete(id: string):void {
    const result = dummyDataKeeper.idAndPostMap.delete(id);
    TslLogUtil.info('deleted post ' + id + ', and the result is ' + result);
  }

  public listEmojiEvaluations(postId: string): IEmojiEvaluation[] {
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
  public createEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
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
  public deleteEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
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
