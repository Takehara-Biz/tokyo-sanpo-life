import { ReqLogUtil } from "../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../firebase/firebaseAdminManager";
import { IUser } from "../serverTslDef";
import { IUsersDao } from "./iUsersDao";

export class FirestoreUsersDao implements IUsersDao {
  private static readonly COLLECTION_NAME = "users";
  private static readonly FIREBASE_USER_ID = "firebaseUserId";

  public async read(userId: string): Promise<IUser | null> {
    
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", userId).get();
    let result = null;
    usersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + doc.data());
      result = doc.data() as IUser;
    });
    ReqLogUtil.debug('findUser result : ' + JSON.stringify(result));
    return result;
  }

  public async create(user: IUser): Promise<void> {
    ReqLogUtil.info('createUser : ' + JSON.stringify(user));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    await usersRef.add(user);
  }

  public async update(user: IUser): Promise<void> {
    ReqLogUtil.info('updateUser : ' + JSON.stringify(user));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", user.firebaseUserId).get();
    
    await usersSnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      await doc.ref.update({
        userName: user.userName,
        userIconBase64: user.userIconBase64,
        selfIntroduction: user.selfIntroduction,
        xProfileLink: user.xProfileLink,
        instagramProfileLink: user.instagramProfileLink,
        updatedAt: user.updatedAt,
      });
    });
  }

  public async delete(userId: string): Promise<void> {
    ReqLogUtil.info('deleteUser : ' + JSON.stringify(userId));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", userId).get();
    
    await usersSnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      await doc.ref.delete();
    });
  }
}
