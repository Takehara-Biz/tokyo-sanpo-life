import { ReqLogUtil } from "../../utils/reqLogUtil"
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { FirestoreUsersDao } from "../dao/firestoreUsersDao";
import { IUsersDao } from "../dao/iUsersDao";
import { IUser} from "../serverTslDef";

class UserLogic {
  //private usersDao: IUsersDao = new MockUsersDao();
  private usersDao: IUsersDao = new FirestoreUsersDao();

  public logout(): void {
    ReqLogUtil.info('called logout');
    const loggedInUser = TSLThreadLocal.currentContext.loggedInUser
    if( loggedInUser != undefined){
      ReqLogUtil.debug('do logout');
      loggedInUser.loggedIn = false;
      return this.usersDao.update(loggedInUser);
    } else {
      ReqLogUtil.debug('do not logout, because no user in thread local...');
    }
  }

  public async findUser(userId: string): Promise<IUser | null> {
    const result = await this.usersDao.read(userId);
    //TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    ReqLogUtil.debug('bbb');
    return result;
  }

  public createUser(user: IUser): void {
    user.loggedIn = true;
    const now = new Date();
    user.insertedAt = now;
    user.updatedAt = now;
    return this.usersDao.create(user);
  }

  public updateUser(user: IUser): void {
    user.updatedAt = new Date();
    return this.usersDao.update(user);
  }

  public deleteUser(userId: string): void {
    return this.usersDao.delete(userId);
  }
}
export const userLogic = new UserLogic();