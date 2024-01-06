import { ReqLogUtil } from "../../utils/reqLogUtil"
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { UsersColDao } from "../dao/firestore/usersColDao";
import { IUsersDao } from "../dao/interface/iUsersDao";
import { UserDto } from "../dto/userDto";

class UserBizLogic {
  //private usersDao: UserDtosDao = new MockUsersDao();
  private usersDao: IUsersDao = new UsersColDao();

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
    if(result == null){
      ReqLogUtil.warn('there is no such user. user id : ' + userId);
    }
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
      ReqLogUtil.warn('firebasedUserId in firestore : ' + user.firebaseUserId);
      return false;
    }
    user.updatedAt = new Date();
    await this.usersDao.update(user);
    return true;
  }

  public async updateUserIconBase64(paramUserId: string, newUserIconBase64: string): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId!;
    if(paramUserId !== firebaseUserId){
      ReqLogUtil.warn("cannot update other's user icon! ");
      ReqLogUtil.warn("identifiedFirebaseUserId : " + firebaseUserId);
      ReqLogUtil.warn("paramUserId " + paramUserId);
      return false;
    }

    const user = await this.findUser(paramUserId);
    if(user == null){
      ReqLogUtil.warn('no such user! ' + paramUserId);
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