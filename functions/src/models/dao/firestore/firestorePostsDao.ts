import { geohashQueryBounds } from "geofire-common";
import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { IPost } from "../../serverTslDef";
import { IPostsDao } from "../iPostsDao";

export class FirestorePostsDao implements IPostsDao {
  private static readonly COLLECTION_NAME = "posts";

  public async listOrderbyCreatedDateTime(limit: number = 100, offset: number = 0): Promise<IPost[]> {
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsSnapshot = await postsRef.orderBy('created_at', 'desc').limit(limit).offset(offset).get();
    const results: IPost[] = [];
    postsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + doc.data());
      results.push(doc.data() as IPost);
    });
    ReqLogUtil.debug('findPosts result : ' + JSON.stringify(results));
    return results;
  }

  public async listByGeoQuery(lat: number, lng: number, distanceKM: number, limit: number = 100, offset: number = 0): Promise<IPost[]> {
    const bounds = geohashQueryBounds([lat, lng], distanceKM * 1000);
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const results: IPost[] = [];
    for (const b of bounds) {
      const usersSnapshot = await postsRef.orderBy('geohash').startAt(b[0]).endAt(b[1]).orderBy('created_at', 'desc').limit(limit).offset(offset).get();
      usersSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + doc.data());
        results.push(doc.data() as IPost);
      });
    }

    ReqLogUtil.info('findPosts length : ' + results.length);
    return results;
  }

  public async listByUserId(userId: string): Promise<IPost[]> {
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsSnapshot = await postsRef.orderBy('created_at', 'desc').get();
    const results: IPost[] = [];
    postsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + doc.data());
      results.push(doc.data() as IPost);
    });
    ReqLogUtil.debug('findPosts result : ' + JSON.stringify(results));
    return results;
  }

  public async readWithRelatedData(firestoreDocId: string): Promise<IPost | null> {
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsDocRef = await postsRef.doc(firestoreDocId);
    let result = null;
    postsDocRef.get().then((doc) => {
      if (doc.exists) {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + doc.data());
        result = doc.data() as IPost;
        result.firestoreDocId = doc.id;
      } else {
        ReqLogUtil.warn('not found...');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });

    ReqLogUtil.debug('findPosts result : ' + JSON.stringify(result));
    if(result == null){
      return null;
    }

    // TODO read user, comments, emojiEvaluations!

    return result;
  }

  public async create(post: IPost): Promise<void> {
    ReqLogUtil.info('createPost : ' + JSON.stringify(post));
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    await postsRef.add(post);
  }

  public async delete(firestoreDocId: string): Promise<void> {
    ReqLogUtil.info('deletePost : ' + JSON.stringify(firestoreDocId));
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsDocRef = await postsRef.doc(firestoreDocId);
    postsDocRef.get().then((doc) => {
      if (doc.exists) {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + doc.data());
        doc.ref.delete();
      } else {
        ReqLogUtil.warn('not found...');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });
  }
}
