import { PostsDao } from './dao/postsDao';
import { IPost, IUser } from './serverTslDef';

export class BizLogic {
  private loggedInUser: IUser | undefined;
  public setLoggedInUser(loggedInUser: IUser){
    this.loggedInUser = loggedInUser;
  }
  public logout(): void{
    this.loggedInUser = undefined;
  }
  public getLoggedInUser(): IUser | undefined {
    return this.loggedInUser;
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