import { PostsDao } from './dao/postsDao';
import { IPost } from './serverTslDef';

export class BizLogic {
  private loggedInUserId: string | undefined;
  public setLoggedInUserId(id: string){
    this.loggedInUserId = id;
  }
  public logout(): void{
    this.loggedInUserId = undefined;
  }
  public getLoggedInUserId(): string | undefined {
    return this.loggedInUserId;
  }

  private postsDao = new PostsDao(50);
  
  public findPosts(): IPost[] {
    //return ServerDummyData;
    return this.postsDao.findPosts();
  }

  public findPost(id: string): IPost | null {
    return this.postsDao.findPost(id);
  }

  public createPost(post: IPost): void {
    return this.postsDao.createPost(post);
  }
}