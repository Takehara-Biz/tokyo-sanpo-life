import { TslLogUtil } from "../../utils/tslLogUtil";
import { IPost} from "../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { IPostsDao } from "./iPostsDao";

export class MockPostsDao implements IPostsDao {

  public listOrderbyCreatedDateTime(limit: number, offset: number): IPost[] {
    const list = [...dummyDataKeeper.idAndPostMap.values()].slice(0, limit);
    for(let index in list){
      // remove data used in only detail screen...
      list[index].postComments = [];
      list[index].emojiEvaluations = []
    }
    TslLogUtil.info('findPosts length : ' + list.length);
    return list;
  }

  public listByGeoQuery(lat: number, lng: number, distanceKM: number): IPost[] {
    const result = [...dummyDataKeeper.idAndPostMap.values()].slice(0, 50);
    TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public listByUserId(userId: string): IPost[] {
    let list = [...dummyDataKeeper.idAndPostMap.values()]
    list = list.filter((value: IPost) => value.user.id === userId);
    for(let index in list){
      // remove data used in only detail screen...
      list[index].postComments = [];
      list[index].emojiEvaluations = []
    }
    TslLogUtil.info('findPosts length : ' + list.length);
    return list;
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
}
