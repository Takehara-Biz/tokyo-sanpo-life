import { ReqLogUtil } from "../../utils/reqLogUtil"
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { TslUtil } from "../../utils/tslUtil";
import { BasicUserIconUtil } from "../dao/basicUserIconUtil";
import { UsersColDao } from "../dao/firestore/usersColDao";
import { IPhotoDao } from "../dao/interface/iPhotoDao";
import { IUsersDao } from "../dao/interface/iUsersDao";
import { StoragePhotoDao } from "../dao/storage/StoragePhotoDao";
import { UserDto } from "../dto/userDto";

class UserBizLogic {
  //private usersDao: UserDtosDao = new MockUsersDao();
  private usersDao: IUsersDao = new UsersColDao();
  private photoDao: IPhotoDao = new StoragePhotoDao();


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
    user.userIconUrl = BasicUserIconUtil.defaultUserIconUrl;
    const now = new Date();
    user.insertedAt = now;
    user.updatedAt = now;
    await this.usersDao.create(user);
  }

  public async updateUser(user: UserDto): Promise<boolean> {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId
    if(firebaseUserId != undefined && user.firebaseUserId != firebaseUserId){
      ReqLogUtil.warn('can not update others account!');
      ReqLogUtil.warn('identified firebaseUserId : ' + firebaseUserId);
      ReqLogUtil.warn('firebasedUserId in firestore : ' + user.firebaseUserId);
      return false;
    }
    user.updatedAt = new Date();
    await this.usersDao.update(user);
    return true;
  }

  public async updateUserIcon(paramUserId: string, newUserIconBase64: string): Promise<boolean> {
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
    user.userIconUrl = await this.photoDao.uploadUserIcon(user.firebaseUserId, newUserIconBase64);
    user.userIconUrl += "?ver=" + TslUtil.dateStr(); // add cache buster
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