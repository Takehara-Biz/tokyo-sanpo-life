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
  listEmojiEvaluations(postId: string): IEmojiEvaluation[];
  /**
   * even if there is already an evaluation which meets the param, it is OK. just do nothing.
   * @param postId 
   * @param unicode 
   * @param evaluatingUserId 
   * @returns 
   */
  createEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void;
  /**
   * even if there is no evaluation which meets the param, it is OK. just do nothing.
   * @param postId 
   * @param unicode 
   * @param evaluatingUserId 
   */
  deleteEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void;
}
