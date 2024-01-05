import { PostDoc } from "../doc/postDoc";

export interface IPostsDao {
  /**
   * return list ordered by inserted_at desc
   * @param limit  how many data you want?
   * @param offset how many data you skip from the beginning?
   */
  listOrderbyInsertedAtDesc(limit: number, offset: number): Promise<PostDoc[]>;
  listByGeoQuery(lat: number, lng: number, distanceKM: number): Promise<PostDoc[]>;
  listByUserId(userId: string): Promise<PostDoc[]>;
  read(postId: string): Promise<PostDoc | null>;
  /**
   * 
   * @param post 
   * @returns document Ref Id of firestore.
   */
  create(post: PostDoc): Promise<string>;
  delete(id: string): Promise<void>;
}
