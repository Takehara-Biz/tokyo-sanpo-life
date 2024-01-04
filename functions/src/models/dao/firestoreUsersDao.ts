import { TslLogUtil } from "../../utils/tslLogUtil";
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
      console.log(doc.id, " => ", doc.data());
      result = doc.data() as IUser;
    });
    TslLogUtil.debug('findUser result : ' + JSON.stringify(result));
    return result;
  }

  public async create(user: IUser): Promise<void> {
    TslLogUtil.info('createUser : ' + JSON.stringify(user));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    usersRef.add(user);
  }

  public async update(user: IUser): Promise<void> {
    TslLogUtil.info('updateUser : ' + JSON.stringify(user));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", user.firebaseUserId).get();
    
    usersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      doc.ref.update({
        userName: user.userName,
        userIconBase64: user.userIconBase64,
        selfIntroduction: user.selfIntroduction,
        xProfileLink: user.xProfileLink,
        instagramProfileLink: user.instagramProfileLink
      });
    });
  }

  public async delete(userId: string): Promise<void> {
    TslLogUtil.info('deleteUser : ' + JSON.stringify(userId));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", userId).get();
    
    usersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      doc.ref.delete();
    });
  }
}
