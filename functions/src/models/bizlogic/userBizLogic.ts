import { ReqLogUtil } from "../../utils/reqLogUtil"
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { FirestoreUsersDao } from "../dao/firestore/firestoreUsersDao";
import { IUsersDao } from "../dao/interface/iUsersDao";
import { UserDto } from "../dto/userDto";

class UserBizLogic {
  //private usersDao: UserDtosDao = new MockUsersDao();
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

  public async findUser(userId: string): Promise<UserDto | null> {
    const result = await this.usersDao.read(userId);
    return result;
  }

  public async createUser(user: UserDto): Promise<void> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    user.firebaseUserId = firebaseUserId;
    user.loggedIn = true;
    const now = new Date();
    user.insertedAt = now;
    user.updatedAt = now;
    await this.usersDao.create(user);
  }

  public async updateUser(user: UserDto): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId
    if(user.firebaseUserId != firebaseUserId){
      ReqLogUtil.warn('can not update others account!');
      ReqLogUtil.warn('identified firebaseUserId : ' + firebaseUserId);
      ReqLogUtil.warn('firebasedUserId kept in firestore : ' + user.firebaseUserId);
      return false;
    }
    user.updatedAt = new Date();
    await this.usersDao.update(user);
    return true;
  }

  public async updateUserIconBase64(newUserIconBase64: string): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    const user = await this.findUser(firebaseUserId);
    if(user == null){
      ReqLogUtil.warn('no such user! ' + firebaseUserId);
      return false;
    }
    user.userIconBase64 = newUserIconBase64;
    user.updatedAt = new Date();
    return await this.updateUser(user);
  }

  /**
   * 
   * @param reqParamUserId 
   * @returns true if deleted or do nothing, false if invalid
   */
  public async deleteUser(reqParamUserId: string): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId
    if(reqParamUserId != firebaseUserId){
      ReqLogUtil.warn('can not delete others account!');
      return false;
    }
    await this.usersDao.delete(reqParamUserId);
    return true;
  }
}
export const userLogic = new UserBizLogic();