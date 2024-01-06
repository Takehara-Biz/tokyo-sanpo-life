import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { PostDoc } from "../doc/postDoc";
import { IPostsDao } from "../interface/iPostsDao";
import { dummyDataKeeper } from "./dummyDataKeeper";

export class MockPostsDao implements IPostsDao {
  async listOrderbyInsertedAtDesc(limit: number, offset: number): Promise<PostDoc[]> {
    const list = [...dummyDataKeeper.idAndPostMap.values()].slice(0, limit);
    ReqLogUtil.info('listOrderbyInsertedAtDesc length : ' + list.length);
    return await list;
  }

  async listByGeoQuery(lat: number, lng: number, distanceKM: number): Promise<PostDoc[]> {
    const result = [...dummyDataKeeper.idAndPostMap.values()].slice(0, 50);
    ReqLogUtil.info('listByGeoQuery length : ' + result.length);
    return await result;
  }

  async listByUserId(userId: string): Promise<PostDoc[]> {
    let list = [...dummyDataKeeper.idAndPostMap.values()]
    list = list.filter((value: PostDoc) => value.postedFirebaseUserId === userId);
    ReqLogUtil.info('listByUserId length : ' + list.length);
    return await list;
  }

  async read(postId: string): Promise<PostDoc | null> {
    const result = dummyDataKeeper.idAndPostMap.get(postId) ?? null;
    ReqLogUtil.debug('read result : ' + JSON.stringify(result));
    return await result;
  }

  async create(post: PostDoc): Promise<string> {
    post.firestoreDocId = dummyDataKeeper.nextval().toString();
    ReqLogUtil.info('create : ' + JSON.stringify(post));
    dummyDataKeeper.idAndPostMap.set(post.firestoreDocId!, post);
    return await post.firestoreDocId!;
  }

  async update(post: PostDoc): Promise<void> {
    dummyDataKeeper.idAndPostMap.set(post.firestoreDocId!, post);
  }

  async delete(id: string): Promise<void> {
    const result = dummyDataKeeper.idAndPostMap.delete(id);
    ReqLogUtil.info('deleted post ' + id + ', and the result is ' + result);
  }
}
