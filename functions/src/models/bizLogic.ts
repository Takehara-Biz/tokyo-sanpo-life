import { TslLogUtil } from "../utils/tslLogUtil";
import {PostsDao} from "./dao/postsDao";
import {IPost, IUser} from "./serverTslDef";

export class BizLogic {
  private loggedInUser: IUser | undefined;
  public setLoggedInUser(loggedInUser: IUser) {
    this.loggedInUser = loggedInUser;
  }
  public logout(): void {
    this.loggedInUser = undefined;
  }
  public getLoggedInUser(): IUser | undefined {
    return this.loggedInUser;
  }

  private postsDao = new PostsDao(10);

  public findPosts(): IPost[] {
    const result = this.postsDao.findPosts();
    //TslLogUtil.info('findPosts length : ' + result.length);
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
}
