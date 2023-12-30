import { DaoUtil } from "../dao/daoUtil";
import {PostsDao} from "../dao/postsDao";
import {IEmojiEvaluation, IPost} from "../serverTslDef";

export class PostLogic {
  private postsDao = new PostsDao(DaoUtil.dummyUserCount);

  public findPosts(): IPost[] {
    const result = this.postsDao.findPosts();
    //TslLogUtil.info('findPosts length : ' + result.length);
    return result;
  }

  public findPostsByUserId(userId: string): IPost[] {
    const result = this.postsDao.findPostsByUserId(userId);
    //TslLogUtil.info('findPostsByUserId length : ' + result.length);
    return result;
  }

  public findPost(id: string): IPost | null {
    const result = this.postsDao.findPost(id);
    //TslLogUtil.debug('findPost result : ' + JSON.stringify(result));
    return result;
  }

  public createPost(post: IPost): void {
    //TslLogUtil.info('createPost : ' + JSON.stringify(post));
    return this.postsDao.createPost(post);
  }

  public deletePost(id: string): void {
    return this.postsDao.delete(id);
  }

  public findEmojiEvaluations(postId: string): IEmojiEvaluation[] {
    return this.postsDao.findEmojiEvaluations(postId);
  }

  public putEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
    this.postsDao.putEmojiEvaluation(postId, unicode, evaluatingUserId);
  }

  public removeEmojiEvaluation(postId: string, unicode: string, evaluatingUserId: string): void{
    this.postsDao.removeEmojiEvaluation(postId, unicode, evaluatingUserId);
  }
}
export const postLogic = new PostLogic();