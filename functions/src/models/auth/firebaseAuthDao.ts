import { getAuth } from 'firebase-admin/auth';
import { TslLogUtil } from '../../utils/tslLogUtil';
import { FirebaseAdminManager } from '../firebase/firebaseAdminManager';

class FirebaseAuthDao {

  /**
   * verify the idToken sent from client side.
   * Reference
   * https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ja#verify_id_tokens_using_the_firebase_admin_sdk
   * @param idToken
   * @returns uid (Firebase User Id), or null (if invalid idToken)
   */
  public async verifyIdToken(idToken: string): Promise<string | null>{
    const log = "idToken: " + idToken;
    TslLogUtil.debug(log.substring(0, 20));
    return await getAuth(FirebaseAdminManager.app)
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      //TslLogUtil.info('decodedToken : ' + JSON.stringify(decodedToken));
      const uid = decodedToken.uid;
      TslLogUtil.info('uid : ' + uid);
      // ...
      return uid;
    })
    .catch((error) => {
      TslLogUtil.error('error occurred!');
      TslLogUtil.error(error);
      // Handle error
      return null;
    });
  }

  public alreadyLoggedIn(idToken: string | undefined): boolean{
    return idToken != undefined;
  }
}
export const firebaseAuthDao = new FirebaseAuthDao();