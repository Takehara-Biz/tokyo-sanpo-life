import { geohashQueryBounds } from "geofire-common";
import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { IPostsDao } from "../interface/iPostsDao";
import { PostDoc } from "../doc/postDoc";

export class FirestorePostsDao implements IPostsDao {
  private static readonly COLLECTION_NAME = "posts";

  public async listOrderbyInsertedAtDesc(limit: number = 100, offset: number = 0): Promise<PostDoc[]> {
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsSnapshot = await postsRef.orderBy('insertedAt', 'desc').limit(limit).offset(offset).get();
    const postDocs: PostDoc[] = [];
    postsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + doc.data());
      const postDoc = doc.data() as PostDoc;
      postDoc.firestoreDocId = doc.id;
      postDocs.push(postDoc);
    });
    ReqLogUtil.debug('listOrderbyInsertedAtDesc result : ' + JSON.stringify(postDocs));
    return postDocs;
  }

  public async listByGeoQuery(lat: number, lng: number, distanceKM: number, limit: number = 100, offset: number = 0): Promise<PostDoc[]> {
    const bounds = geohashQueryBounds([lat, lng], distanceKM * 1000);
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postDocs: PostDoc[] = [];
    for (const b of bounds) {
      const usersSnapshot = await postsRef.orderBy('geohash').startAt(b[0]).endAt(b[1]).orderBy('created_at', 'desc').limit(limit).offset(offset).get();
      usersSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + doc.data());
        const postDoc = doc.data() as PostDoc;
        postDoc.firestoreDocId = doc.id;
        postDocs.push(postDoc);
      });
    }

    ReqLogUtil.info('listByGeoQuery length : ' + postDocs.length);
    return postDocs;
  }

  public async listByUserId(userId: string): Promise<PostDoc[]> {
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsSnapshot = await postsRef.orderBy('insertedAt', 'desc').get();
    const postDocs: PostDoc[] = [];
    postsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + doc.data());
      const postDoc = doc.data() as PostDoc;
      postDoc.firestoreDocId = doc.id;
      postDocs.push(postDoc);
    });
    ReqLogUtil.debug('listByUserId result : ' + JSON.stringify(postDocs));
    return postDocs;
  }

  public async read(firestoreDocId: string): Promise<PostDoc | null> {
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const postsDocRef = await postsRef.doc(firestoreDocId);
    let result = null;
    await postsDocRef.get().then((doc) => {
      if (doc.exists) {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + doc.data());
        result = doc.data() as PostDoc;
        result.firestoreDocId = doc.id;
      } else {
        ReqLogUtil.warn('not found...');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });

    ReqLogUtil.debug('findPosts result : ' + JSON.stringify(result));
    if (result == null) {
      return null;
    }

    // TODO read user, comments, emojiEvaluations! and return separately (with tuple?)

    return result;
  }

  public async create(post: PostDoc): Promise<string> {
    ReqLogUtil.info('createPost : ' + JSON.stringify(post));
    const postsRef = FirebaseAdminManager.db.collection(FirestorePostsDao.COLLECTION_NAME);
    const docRef = await postsRef.add(post);
    return docRef.id
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
