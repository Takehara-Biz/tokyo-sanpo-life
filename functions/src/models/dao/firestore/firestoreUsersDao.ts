import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { UserDoc } from "../doc/userDoc";
import { IUsersDao } from "../interface/iUsersDao";

export class FirestoreUsersDao implements IUsersDao {
  private static readonly COLLECTION_NAME = "users";
  private static readonly FIREBASE_USER_ID = "firebaseUserId";

  public async list(userIds: string[]): Promise<Map<string, UserDoc>> {
    const idAndUserDocMap = new Map<string, UserDoc>();
    if(userIds.length === 0){
      return idAndUserDocMap;
    }

    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "in", userIds).get();
    usersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // ReqLogUtil.debug(doc.id + " => " + doc.data());
      idAndUserDocMap.set(doc.id, doc.data() as UserDoc);
    });
    ReqLogUtil.debug('list result : ' + JSON.stringify(idAndUserDocMap));
    return idAndUserDocMap;
  }

  public async read(userId: string): Promise<UserDoc | null> {
    
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", userId).get();
    let result = null;
    usersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + doc.data());
      result = doc.data() as UserDoc;
    });
    ReqLogUtil.debug('find result : ' + JSON.stringify(result));
    return result;
  }

  public async create(user: UserDoc): Promise<void> {
    ReqLogUtil.info('create : ' + JSON.stringify(user));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    await usersRef.add(user);
  }

  public async update(user: UserDoc): Promise<void> {
    ReqLogUtil.info('update : ' + JSON.stringify(user));
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
    ReqLogUtil.info('delete : ' + JSON.stringify(userId));
    const usersRef = FirebaseAdminManager.db.collection(FirestoreUsersDao.COLLECTION_NAME);
    const usersSnapshot = await usersRef.where(FirestoreUsersDao.FIREBASE_USER_ID, "==", userId).get();
    
    await usersSnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      await doc.ref.delete();
    });
  }
}
