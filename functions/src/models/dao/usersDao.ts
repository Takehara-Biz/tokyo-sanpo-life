import { TslLogUtil } from "../../utils/tslLogUtil";
import { IUser } from "../serverTslDef";
import { DaoUtil } from "./daoUtil";
import { defaultUserIconBase64 } from "./defaultUserIconBase64";

export class UsersDao {
  private idAndUserMap: Map<string, IUser> = new Map<string, IUser>();

  constructor(userCount: number) {
    this.generateRandomUsers(userCount);
  }

  private generateRandomUsers(postCount: number): void {
    for (let i = 0; i < postCount; i++) {
      const user = {
        id: i.toString(),
        userName: DaoUtil.generateRandomString(3, 12),
        userIconBase64: defaultUserIconBase64,
        selfIntroduction: "こんにちは〜。" + DaoUtil.generateRandomString(1, 50),
        twitterProfileLink: "https://www.yahoo.co.jp",
        instagramProfileLink: "https://www.yahoo.co.jp",
      };
      this.idAndUserMap.set(i.toString(), user);
    }
  }

  public findUser(id: string): IUser | null {
    const result = this.idAndUserMap.get(id) ?? null;
    TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    return result;
  }

  public createUser(user: IUser): void {
    TslLogUtil.info('createUser : ' + JSON.stringify(user));
    this.idAndUserMap.set(user.id, user);
  }
}
