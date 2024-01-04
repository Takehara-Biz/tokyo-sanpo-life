import { App, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from "../auth/publicEnvVarsModule";
import { TslLogUtil } from "../../utils/tslLogUtil";

export class FirebaseAdminManager {
  public static app: App;
  public static db: Firestore;
  public static initialize(){
    TslLogUtil.info('[BEGIN] FirebaseAdminManager.initialize');
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    TslLogUtil.info('[  END] FirebaseAdminManager.initialize');
  }
}