import { UsersDao } from "../dao/usersDao";
import { IUser} from "../serverTslDef";

export class UserLogic {
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
  public alreadyLoggedIn(): boolean {
    return this.loggedInUser !== undefined;
  }

  private usersDao = new UsersDao(10);

  public findUser(id: string): IUser | null {
    const result = this.usersDao.findUser(id);
    //TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    return result;
  }

  public createUser(user: IUser): void {
    return this.usersDao.createUser(user);
  }
}
