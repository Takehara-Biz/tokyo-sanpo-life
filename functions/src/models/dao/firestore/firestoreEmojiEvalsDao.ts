import { ReqLogUtil } from "../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../firebase/firebaseAdminManager";
import { IEmojiEvalsDao } from "../interface/iEmojiEvalsDao";
import { EmojiEvalDoc } from "../doc/emojiEvalsDoc";

export class FirestoreEmojiEvalsDao implements IEmojiEvalsDao {
  private static readonly COLLECTION_NAME = "emojiEvaluations";

  async read(commentId: string): Promise<EmojiEvalDoc | null> {
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvalsDao.COLLECTION_NAME);
    const emojiEvaluationsDocRef = await emojiEvaluationsRef.doc(commentId);
    let result = null;
    await emojiEvaluationsDocRef.get().then((doc) => {
      if (doc.exists) {
        result = doc.data() as EmojiEvalDoc;
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

  async list(postId: string): Promise<EmojiEvalDoc[]> {
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvalsDao.COLLECTION_NAME);
    const emojiEvaluationsSnapshot = await emojiEvaluationsRef.where('postFirestoreDocId', '==', postId).orderBy('insertedAt', 'asc').get();
    const emojiEvaluationDocs: EmojiEvalDoc[] = [];
    emojiEvaluationsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + doc.data());
      const emojiEvaluationDoc = doc.data() as EmojiEvalDoc;
      emojiEvaluationDoc.firestoreDocId = doc.id;
      emojiEvaluationDocs.push(emojiEvaluationDoc);
    });
    ReqLogUtil.debug('list length : ' + emojiEvaluationDocs.length);
    return emojiEvaluationDocs;
  }

  async create(emojiEvaluationDoc: EmojiEvalDoc): Promise<void> {
    ReqLogUtil.info('createEmojiEvaluation : ' + ReqLogUtil.jsonStr(emojiEvaluationDoc));
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvalsDao.COLLECTION_NAME);
    await emojiEvaluationsRef.add(emojiEvaluationDoc);
  }

  async delete(emojiEvaluationFirestoreDocId: string): Promise<void> {
    ReqLogUtil.info('deleteEmojiEvaluation emojiDoc id : ' + emojiEvaluationFirestoreDocId);
    const emojiEvaluationsRef = FirebaseAdminManager.db.collection(FirestoreEmojiEvalsDao.COLLECTION_NAME);
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
