import { TslLogUtil } from "../../utils/tslLogUtil";
import { DaoUtil } from "../dao/daoUtil";
import { UsersDao } from "../dao/usersDao";
import { IUser} from "../serverTslDef";

class UserLogic {
  private loggedInUser: IUser | undefined;

  public setLoggedInUser(loggedInUser: IUser) {
    this.loggedInUser = loggedInUser;
  }
  public logout(): void {
    TslLogUtil.info('called logout');
    this.loggedInUser = undefined;
  }
  public getLoggedInUser(): IUser | undefined {
    TslLogUtil.debug('loggedInUser: ' + this.loggedInUser);
    return this.loggedInUser;
  }
  public alreadyLoggedIn(): boolean {
    return this.loggedInUser !== undefined;
  }

  private usersDao = new UsersDao(DaoUtil.dummyUserCount);

  public findUser(id: string): IUser | null {
    const result = this.usersDao.findUser(id);
    //TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    return result;
  }

  public createUser(user: IUser): void {
    return this.usersDao.createUser(user);
  }
}
export const userLogic = new UserLogic();