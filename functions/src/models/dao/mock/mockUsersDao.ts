// import { ReqLogUtil } from "../../utils/reqLogUtil";
// import { IUser } from "../serverTslDef";
// import { dummyDataKeeper } from "./dummyDataKeeper";
// import { IUsersDao } from "./iUsersDao";

// export class MockUsersDao implements IUsersDao{

//   public read(userId: string): Promise<IUser | null> {
//     const result = dummyDataKeeper.idAndUserMap.get(userId) ?? null;
//     ReqLogUtil.debug('findUser result : ' + JSON.stringify(result));
//     const promise = new Promise<IUser | null>((resolve, reject) => {
//         resolve(result);
//     });
//     promise.then((res) => {
//         return result;
//     });
//     return promise;
//   }

//   create(user: IUser): void {
//     ReqLogUtil.info('createUser : ' + JSON.stringify(user));
//     dummyDataKeeper.idAndUserMap.set(user.firebaseUserId, user);
//   }

//   update(user: IUser): void {
//     ReqLogUtil.info('updateUser : ' + JSON.stringify(user));
//     dummyDataKeeper.idAndUserMap.set(user.firebaseUserId, user);
//   }

//   delete(userId: string): void {
//     ReqLogUtil.info('deleteUser : ' + JSON.stringify(userId));
//     dummyDataKeeper.idAndUserMap.delete(userId);
//   }
// }
