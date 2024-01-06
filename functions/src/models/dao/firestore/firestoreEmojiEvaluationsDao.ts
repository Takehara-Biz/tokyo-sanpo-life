import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { IEmojiEvaluationsDao } from "../interface/iEmojiEvaluationsDao";
import { EmojiEvaluationDoc } from "../doc/emojiEvaluationDoc";

export class FirestoreEmojiEvaluationsDao implements IEmojiEvaluationsDao {
  private static readonly COLLECTION_NAME = "emojiEvaluations";

  async read(commentId: string): Promise<EmojiEvaluationDoc | null> {
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvaluationsDao.COLLECTION_NAME);
    const emojiEvaluationsDocRef = await emojiEvaluationsRef.doc(commentId);
    let result = null;
    await emojiEvaluationsDocRef.get().then((doc) => {
      if (doc.exists) {
        result = doc.data() as EmojiEvaluationDoc;
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

  async list(postId: string): Promise<EmojiEvaluationDoc[]> {
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvaluationsDao.COLLECTION_NAME);
    const emojiEvaluationsSnapshot = await emojiEvaluationsRef.where('postFirestoreDocId', '==', postId).orderBy('insertedAt', 'asc').get();
    const emojiEvaluationDocs: EmojiEvaluationDoc[] = [];
    emojiEvaluationsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + doc.data());
      const emojiEvaluationDoc = doc.data() as EmojiEvaluationDoc;
      emojiEvaluationDoc.firestoreDocId = doc.id;
      emojiEvaluationDocs.push(emojiEvaluationDoc);
    });
    ReqLogUtil.debug('list length : ' + emojiEvaluationDocs.length);
    return emojiEvaluationDocs;
  }

  async create(emojiEvaluationDoc: EmojiEvaluationDoc): Promise<void> {
    ReqLogUtil.info('createEmojiEvaluation : ' + ReqLogUtil.jsonStr(emojiEvaluationDoc));
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvaluationsDao.COLLECTION_NAME);
    await emojiEvaluationsRef.add(emojiEvaluationDoc);
  }

  async delete(emojiEvaluationFirestoreDocId: string): Promise<void> {
    ReqLogUtil.info('deleteEmojiEvaluation emojiDoc id : ' + emojiEvaluationFirestoreDocId);
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvaluationsDao.COLLECTION_NAME);
    const emojiEvaluationsDocRef = await emojiEvaluationsRef.doc(emojiEvaluationFirestoreDocId);
    emojiEvaluationsDocRef.get().then((doc) => {
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
