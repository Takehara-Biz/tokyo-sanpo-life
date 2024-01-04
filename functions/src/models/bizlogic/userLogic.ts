import { ReqLogUtil } from "../../utils/reqLogUtil"
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { FirestoreUsersDao } from "../dao/firestoreUsersDao";
import { IUsersDao } from "../dao/iUsersDao";
import { IUser} from "../serverTslDef";

class UserLogic {
  //private usersDao: IUsersDao = new MockUsersDao();
  private usersDao: IUsersDao = new FirestoreUsersDao();

  public async logout(): Promise<void> {
    ReqLogUtil.info('called logout');
    const loggedInUser = TSLThreadLocal.currentContext.loggedInUser
    if( loggedInUser != undefined){
      ReqLogUtil.debug('do logout');
      loggedInUser.loggedIn = false;
      return await this.usersDao.update(loggedInUser);
    } else {
      ReqLogUtil.debug('do not logout, because no user in thread local...');
    }
  }

  public async findUser(userId: string): Promise<IUser | null> {
    const result = await this.usersDao.read(userId);
    //TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    return result;
  }

  public async createUser(user: IUser): Promise<void> {
    user.loggedIn = true;
    const now = new Date();
    user.insertedAt = now;
    user.updatedAt = now;
    return await this.usersDao.create(user);
  }

  public async updateUser(user: IUser): Promise<void> {
    user.updatedAt = new Date();
    return await this.usersDao.update(user);
  }

  public async deleteUser(userId: string): Promise<void> {
    return await this.usersDao.delete(userId);
  }
}
export const userLogic = new UserLogic();