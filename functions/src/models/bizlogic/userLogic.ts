import { TslLogUtil } from "../../utils/tslLogUtil";
import { DaoUtil } from "../dao/daoUtil";
import { defaultUserIconBase64 } from "../dao/defaultUserIconBase64";
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

    // UserLogicが毎回インスタンスが作り直されるので、ダミーを用意した。必要に応じてコメントを外すと良い。
    this.loggedInUser = {
      id: "1",
      userName: DaoUtil.generateRandomString(3, 12),
      userIconBase64: defaultUserIconBase64,
      selfIntroduction: "こんにちは〜。" + DaoUtil.generateRandomString(1, 50),
      twitterProfileLink: "https://www.yahoo.co.jp",
      instagramProfileLink: "https://www.yahoo.co.jp",
    };

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