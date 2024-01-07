import { geohashQueryBounds } from "geofire-common";
import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { IPostsDao } from "../interface/iPostsDao";
import { PostDoc } from "../doc/postDoc";

export class PostsColDao implements IPostsDao {
  public static readonly COL_NAME = "posts";

  async listOrderbyInsertedAtDesc(limit: number = 100, offset: number = 0): Promise<PostDoc[]> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsSnapshot = await postsRef.orderBy('insertedAt', 'desc').limit(limit).offset(offset).get();
    const postDocs: PostDoc[] = [];
    postsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + doc.data());
      const postDoc = doc.data() as PostDoc;
      postDoc.firestoreDocId = doc.id;
      postDocs.push(postDoc);
    });
    ReqLogUtil.debug('listOrderbyInsertedAtDesc length : ' + postDocs.length);
    return postDocs;
  }

  async listByGeoQuery(lat: number, lng: number, distanceKM: number, limit: number = 100, offset: number = 0): Promise<PostDoc[]> {
    const bounds = geohashQueryBounds([lat, lng], distanceKM * 1000);
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postDocs: PostDoc[] = [];
    for (const b of bounds) {
      const usersSnapshot = await postsRef.orderBy('geohash').startAt(b[0]).endAt(b[1]).orderBy('created_at', 'desc').limit(limit).offset(offset).get();
      usersSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //ReqLogUtil.debug(doc.id + " => " + doc.data());
        const postDoc = doc.data() as PostDoc;
        postDoc.firestoreDocId = doc.id;
        postDocs.push(postDoc);
      });
    }

    ReqLogUtil.info('listByGeoQuery length : ' + postDocs.length);
    return postDocs;
  }

  async listByUserId(userId: string): Promise<PostDoc[]> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsSnapshot = await postsRef.orderBy('insertedAt', 'desc').get();
    const postDocs: PostDoc[] = [];
    postsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + doc.data());
      const postDoc = doc.data() as PostDoc;
      postDoc.firestoreDocId = doc.id;
      postDocs.push(postDoc);
    });
    ReqLogUtil.debug('listByUserId length : ' + postDocs.length);
    return postDocs;
  }

  async read(firestoreDocId: string): Promise<PostDoc | null> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(firestoreDocId);
    let result = null;
    await postsDocRef.get().then((doc) => {
      if (doc.exists) {
        result = doc.data() as PostDoc;
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug('got => ' + doc.id);
        result.firestoreDocId = doc.id;
      } else {
        ReqLogUtil.warn('not found...');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });

    ReqLogUtil.debug('read result : ' + ReqLogUtil.jsonStr(result));
    if (result == null) {
      return null;
    }

    // TODO read user, comments, emojiEvaluations! and return separately (with tuple?)

    return result;
  }

  async create(postDoc: PostDoc): Promise<string> {
    ReqLogUtil.info('createPost : ' + ReqLogUtil.jsonStr(postDoc));
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const docRef = await postsRef.add(postDoc);
    return docRef.id
  }

  async update(newPostDoc: PostDoc): Promise<void> {
    ReqLogUtil.info('updatePost : ' + ReqLogUtil.jsonStr(newPostDoc));
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(newPostDoc.firestoreDocId!);
    let result = null;
    await postsDocRef.get().then((doc) => {
      if (doc.exists) {
        result = doc.data() as PostDoc;
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(result));
        doc.ref.update({
          // only some properties will be updated!

          //firestoreDocId?: string;
          //postedFirebaseUserId: string;
          //photoUrl?: string;
          lat: newPostDoc.lat,
          lng: newPostDoc.lng,
          geohash: newPostDoc.geohash,
          categoryId: newPostDoc.categoryId,
          description: newPostDoc.description,
          //insertedAt: Timestamp;
          updatedAt: newPostDoc.updatedAt,
        });
      } else {
        ReqLogUtil.warn('not found... ' + newPostDoc.firestoreDocId!);
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });
  }

  async updateForPhoto(firestoreDocId: string, photoUrl: string): Promise<void> {
    ReqLogUtil.info('updateForPhoto : ');
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(firestoreDocId!);
    await postsDocRef.get().then((doc) => {
      if (doc.exists) {
        doc.ref.update({
          photoUrl: photoUrl
        });
      } else {
        ReqLogUtil.error('something wrong!! failed adding photoUrl info!!');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });
  }

  async delete(firestoreDocId: string): Promise<boolean> {
    ReqLogUtil.info('deletePost post id : ' + firestoreDocId);
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(firestoreDocId);
    const result = postsDocRef.get().then(async (doc) => {
      if (doc.exists) {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(doc.data()));
        await doc.ref.delete();
        return true;
      } else {
        ReqLogUtil.warn('not found...');
        return false;
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
      return false;
    });
    return result;
  }
}
