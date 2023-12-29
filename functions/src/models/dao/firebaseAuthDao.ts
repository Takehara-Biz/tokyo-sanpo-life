
import { App, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { TslLogUtil } from '../../utils/tslLogUtil';

export class FirebaseAuthDao {
  public app: App;
  constructor(){
    const firebaseConfig = {
      apiKey: "AIzaSyAW0fJXkv5YGBZDcFdNeaQdH4s0JwRVIec",
      authDomain: "tokyo-sanpo-life.firebaseapp.com",
      projectId: "tokyo-sanpo-life",
      storageBucket: "tokyo-sanpo-life.appspot.com",
      messagingSenderId: "702612803712",
      appId: "1:702612803712:web:1700ffd54eef1da20a1665",
      measurementId: "G-DNVGJXLX5J"
    };
    this.app = initializeApp(firebaseConfig);
  }
  
  /**
   * verify the idToken sent from client side.
   * Reference
   * https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ja#verify_id_tokens_using_the_firebase_admin_sdk
   * @param idToken
   */
  public async verifyIdToken(idToken: string): Promise<boolean>{
    return await getAuth(this.app)
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      TslLogUtil.info('decodedToken : ' + decodedToken);
      const uid = decodedToken.uid;
      TslLogUtil.info('uid : ' + uid);
      // ...
      return true;
    })
    .catch((error) => {
      TslLogUtil.error('error occurred!');
      TslLogUtil.error(error);
      // Handle error
      return false;
    });
  }
}