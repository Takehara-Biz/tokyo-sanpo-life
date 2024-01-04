import { TslLogUtil } from "../../utils/tslLogUtil"
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { FirestoreUsersDao } from "../dao/firestoreUsersDao";
import { IUsersDao } from "../dao/iUsersDao";
//import { MockUsersDao } from "../dao/mockUsersDao";
import { IUser} from "../serverTslDef";

class UserLogic {
  //private usersDao: IUsersDao = new MockUsersDao();
  private usersDao: IUsersDao = new FirestoreUsersDao();
  private uidAndLoggedInUser = new Map<string, IUser>();

  public setLoggedInUser(uid: string, loggedInUser: IUser) {
    this.uidAndLoggedInUser.set(uid, loggedInUser);
  }
  public logout(): void {
    TslLogUtil.info('called logout');
    const uid = TSLThreadLocal.currentContext.identifiedFirebaseUserId
    if( uid != undefined){
      this.uidAndLoggedInUser.delete(uid);
    }
  }
  public getLoggedInUser(uid: string): IUser | undefined {
    return this.uidAndLoggedInUser.get(uid);
  }
  public alreadyLoggedIn(uid: string): boolean {
    return TSLThreadLocal.currentContext?.loggedInUser != undefined
  }

  public async findUser(userId: string): Promise<IUser | null> {
    const result = await this.usersDao.read(userId);
    //TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    TslLogUtil.debug('bbb');
    return result;
  }

  public createUser(user: IUser): void {
    return this.usersDao.create(user);
  }

  public updateUser(user: IUser): void {
    return this.usersDao.update(user);
  }

  public deleteUser(userId: string): void {
    return this.usersDao.delete(userId);
  }
}
export const userLogic = new UserLogic();