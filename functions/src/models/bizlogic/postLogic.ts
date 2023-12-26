import {PostsDao} from "../dao/postsDao";
import {IPost} from "../serverTslDef";

export class PostLogic {
  private postsDao = new PostsDao(10);

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
}
