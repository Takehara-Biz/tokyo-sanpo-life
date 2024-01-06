import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { ICommentsDao } from "../interface/iCommentsDao";
import { CommentDoc } from "../doc/commentDoc";

export class CommentsColDao implements ICommentsDao {
  private static readonly COL_NAME = "comments";

  async read(commentId: string): Promise<CommentDoc | null> {
    const commentsRef = FirebaseAdminManager.db.collection(CommentsColDao.COL_NAME);
    const commentsDocRef = await commentsRef.doc(commentId);
    let result = null;
    await commentsDocRef.get().then((doc) => {
      if (doc.exists) {
        result = doc.data() as CommentDoc;
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(result));
        result.firestoreDocId = doc.id;
      } else {
        ReqLogUtil.warn('not found...');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });

    ReqLogUtil.debug('read result : ' + ReqLogUtil.jsonStr(result));
    return result;
  }

  async listOrderbyInsertedAtAsc(postId: string): Promise<CommentDoc[]> {
    const commentsRef = FirebaseAdminManager.db.collection(CommentsColDao.COL_NAME);
    const commentsSnapshot = await commentsRef.where('postFirestoreDocId', '==', postId).orderBy('insertedAt', 'asc').get();
    const commentDocs: CommentDoc[] = [];
    commentsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + doc.data());
      const commentDoc = doc.data() as CommentDoc;
      commentDoc.firestoreDocId = doc.id;
      commentDocs.push(commentDoc);
    });
    ReqLogUtil.debug('listOrderbyInsertedAtAsc length : ' + commentDocs.length);
    return commentDocs;
  }

  public async countTotalComments(postId: string): Promise<number>{
    const commentsRef = FirebaseAdminManager.db.collection(CommentsColDao.COL_NAME);
    const commentsSnapshot = await commentsRef.where('postFirestoreDocId', '==', postId).count().get();
    return commentsSnapshot.data().count;
  }

  async create(commentDoc: CommentDoc): Promise<void> {
    ReqLogUtil.info('createComment : ' + ReqLogUtil.jsonStr(commentDoc));
    const commentsRef = FirebaseAdminManager.db.collection(CommentsColDao.COL_NAME);
    await commentsRef.add(commentDoc);
  }

  async delete(commentFirestoreDocId: string): Promise<void> {
    ReqLogUtil.info('deleteComment comment id : ' + commentFirestoreDocId);
    const commentsRef = FirebaseAdminManager.db.collection(CommentsColDao.COL_NAME);
    const commentsDocRef = await commentsRef.doc(commentFirestoreDocId);
    commentsDocRef.get().then((doc) => {
      if (doc.exists) {
        // doc.data() is never undefined for query doc snapshots
        ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(doc.data()));
        doc.ref.delete();
      } else {
        ReqLogUtil.warn('not found...');
      }
    }).catch((error) => {
      ReqLogUtil.error('error occurred! ' + error);
    });
  }
}
