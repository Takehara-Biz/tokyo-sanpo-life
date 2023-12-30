import { IEmojiEvaluation, IPost } from "../serverTslDef";

export interface IPostsDao {
  /**
   * return list ordered by created date time
   * @param limit  how many data you want?
   * @param offset how many data you skip from the beginning?
   */
  listOrderbyCreatedDateTime(limit: number, offset: number): IPost[];
  listByGeoQuery(lat: number, lng: number, distanceKM: number): IPost[];
  listByUserId(userId: string): IPost[];
  read(postId: string): IPost | null;
  create(post: IPost): void;
  delete(id: string): void;
}
