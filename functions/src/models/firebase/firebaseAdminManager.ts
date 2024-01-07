import { App, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from "../auth/publicEnvVarsModule";

export class FirebaseAdminManager {
  public static app: App;
  public static db: Firestore;
  public static initialize(){
    console.info('[BEGIN] FirebaseAdminManager.initialize');
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    console.info('[  END] FirebaseAdminManager.initialize');
  }
}