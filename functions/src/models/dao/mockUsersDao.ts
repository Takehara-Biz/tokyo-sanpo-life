import { TslLogUtil } from "../../utils/tslLogUtil";
import { IUser } from "../serverTslDef";
import { dummyDataKeeper } from "./dummyDataKeeper";
import { IUsersDao } from "./iUsersDao";

export class MockUsersDao implements IUsersDao{

  public read(userId: string): Promise<IUser | null> {
    const result = dummyDataKeeper.idAndUserMap.get(userId) ?? null;
    TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    const promise = new Promise<IUser | null>((resolve, reject) => {
        resolve(result);
    });
    promise.then((res) => {
        return result;
    });
    return promise;
  }

  public create(user: IUser): void {
    TslLogUtil.info('createUser : ' + JSON.stringify(user));
    dummyDataKeeper.idAndUserMap.set(user.firebaseUserId, user);
  }

  public update(user: IUser): void {
    TslLogUtil.info('updateUser : ' + JSON.stringify(user));
    dummyDataKeeper.idAndUserMap.set(user.firebaseUserId, user);
  }

  public delete(userId: string): void {
    TslLogUtil.info('deleteUser : ' + JSON.stringify(userId));
    dummyDataKeeper.idAndUserMap.delete(userId);
  }
}
