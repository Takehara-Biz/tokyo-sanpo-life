import { IPost } from "../serverTslDef";

export interface IPostsDao {
  /**
   * return list ordered by created date time
   * @param limit  how many data you want?
   * @param offset how many data you skip from the beginning?
   */
  listOrderbyCreatedDateTime(limit: number, offset: number): Promise<IPost[]>;
  listByGeoQuery(lat: number, lng: number, distanceKM: number): Promise<IPost[]>;
  listByUserId(userId: string): Promise<IPost[]>;
  readWithRelatedData(postId: string): Promise<IPost | null>;
  create(post: IPost): Promise<void>;
  delete(id: string): Promise<void>;
}
