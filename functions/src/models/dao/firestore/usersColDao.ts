import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { UserDoc } from "../doc/userDoc";
import { IUsersDao } from "../interface/iUsersDao";

export class UsersColDao implements IUsersDao {
  private static readonly COL_NAME = "users";
  private static readonly FIREBASE_USER_ID = "firebaseUserId";

  async list(userIds: string[]): Promise<Map<string, UserDoc>> {
    ReqLogUtil.debug('list param : ' + userIds);
    const idAndUserDocMap = new Map<string, UserDoc>();
    if (userIds.length === 0) {
      return idAndUserDocMap;
    }

    // 1行で書かないとダメっぽい
    // https://stackoverflow.com/questions/59505269/error-value-for-argument-value-is-not-a-valid-query-constraint-cannot-use-u
    const usersSnapshot = await FirebaseAdminManager.db.collection(UsersColDao.COL_NAME).where(UsersColDao.FIREBASE_USER_ID, "in", userIds).get();
    await usersSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // ReqLogUtil.debug(doc.id + " => " + doc.data());
      const userDoc = doc.data() as UserDoc;
      idAndUserDocMap.set(userDoc.firebaseUserId, userDoc);
    });
    ReqLogUtil.debug('list result length : ' + idAndUserDocMap.size);
    return idAndUserDocMap;
  }

  async read(userId: string): Promise<UserDoc | null> {
    ReqLogUtil.debug('userId : ' + userId);

    const usersSnapshot = await FirebaseAdminManager.db.collection(UsersColDao.COL_NAME).where(UsersColDao.FIREBASE_USER_ID, "==", userId).get();
    let userDoc: UserDoc | null = null;
    usersSnapshot.forEach((doc) => {
      userDoc = doc.data() as UserDoc;
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(userDoc));

    });
    ReqLogUtil.debug('find result : ' + userDoc);
    return userDoc;
  }

  async create(user: UserDoc): Promise<void> {
    ReqLogUtil.info('create : ' + ReqLogUtil.jsonStr(user));
    const usersRef = FirebaseAdminManager.db.collection(UsersColDao.COL_NAME);
    await usersRef.add(user);
  }

  async update(user: UserDoc): Promise<void> {
    ReqLogUtil.info('update : ' + ReqLogUtil.jsonStr(user));
    const usersRef = FirebaseAdminManager.db.collection(UsersColDao.COL_NAME);
    const usersSnapshot = await usersRef.where(UsersColDao.FIREBASE_USER_ID, "==", user.firebaseUserId).get();

    await usersSnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", ReqLogUtil.jsonStr(doc.data()));
      await doc.ref.update({
        userName: user.userName,
        userIconUrl: user.userIconUrl,
        selfIntroduction: user.selfIntroduction,
        xProfileLink: user.xProfileLink,
        instagramProfileLink: user.instagramProfileLink,
        updatedAt: user.updatedAt,
      });
    });
  }

  async delete(userId: string): Promise<void> {
    ReqLogUtil.info('delete user id : ' + userId);
    const usersRef = FirebaseAdminManager.db.collection(UsersColDao.COL_NAME);
    const usersSnapshot = await usersRef.where(UsersColDao.FIREBASE_USER_ID, "==", userId).get();

    await usersSnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", ReqLogUtil.jsonStr(doc.data()));
      await doc.ref.delete();
    });
  }
}
