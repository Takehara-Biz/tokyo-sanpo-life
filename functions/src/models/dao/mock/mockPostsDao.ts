import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { IPost} from "../../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { IPostsDao } from "../iPostsDao";

export class MockPostsDao implements IPostsDao {

  public async listOrderbyCreatedDateTime(limit: number, offset: number): Promise<IPost[]> {
    const list = [...dummyDataKeeper.idAndPostMap.values()].slice(0, limit);
    for(let index in list){
      // remove data used in only detail screen...
      list[index].postComments = [];
      list[index].emojiEvaluations = []
    }
    ReqLogUtil.info('findPosts length : ' + list.length);
    return await list;
  }

  public async listByGeoQuery(lat: number, lng: number, distanceKM: number): Promise<IPost[]> {
    const result = [...dummyDataKeeper.idAndPostMap.values()].slice(0, 50);
    ReqLogUtil.info('findPosts length : ' + result.length);
    return await result;
  }

  public listByUserId(userId: string): IPost[] {
    let list = [...dummyDataKeeper.idAndPostMap.values()]
    list = list.filter((value: IPost) => value.user.firebaseUserId === userId);
    for(let index in list){
      // remove data used in only detail screen...
      list[index].postComments = [];
      list[index].emojiEvaluations = []
    }
    ReqLogUtil.info('findPosts length : ' + list.length);
    return list;
  }

  public read(postId: string): IPost | null {
    const result = dummyDataKeeper.idAndPostMap.get(postId) ?? null;
    ReqLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public create(post: IPost):void {
    post.id = dummyDataKeeper.nextval().toString();
    ReqLogUtil.info('createPost : ' + JSON.stringify(post));
    dummyDataKeeper.idAndPostMap.set(post.id, post);
  }

  public delete(id: string):void {
    const result = dummyDataKeeper.idAndPostMap.delete(id);
    ReqLogUtil.info('deleted post ' + id + ', and the result is ' + result);
  }
}
