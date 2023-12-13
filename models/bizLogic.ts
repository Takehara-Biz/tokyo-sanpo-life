import { PostsDao } from './dao/postsDao';
import { IPost } from './serverTslDef';

export class BizLogic {
  private postsDao = new PostsDao();
  
  public findPosts(): IPost[] {
    //return ServerDummyData;
    return this.postsDao.findPosts();
  }

  public findPost(id: string): IPost {
    return this.postsDao.findPost(id);
  }
}