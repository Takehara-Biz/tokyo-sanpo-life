import { ReqLogUtil } from "../../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../../firebase/firebaseAdminManager";
import { EmojiEvalDoc } from "../../doc/post/emojiEvalsDoc";
import { IEmojiEvalsDao } from "../../interface/iEmojiEvalsDao";
import { PostsColDao } from "../postsColDao";

export class EmojiEvalsSubColDao implements IEmojiEvalsDao {
  private static readonly SUB_COL_NAME = "emojiEvals";

  async read(postId: string, commentId: string): Promise<EmojiEvalDoc | null> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvaluationsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
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
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvaluationsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
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

  async create(postId: string, emojiEvalDoc: EmojiEvalDoc): Promise<void> {
    ReqLogUtil.info('createEmojiEval : ' + ReqLogUtil.jsonStr(emojiEvalDoc));

    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvalsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    await emojiEvalsRef.add(emojiEvalDoc);
  }

  async delete(postId: string, emojiEvalFirestoreDocId: string): Promise<void> {
    ReqLogUtil.info('deleteEmojiEval emojiDoc id : ' + emojiEvalFirestoreDocId);

    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvalsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    const emojiEvalsDocRef = await emojiEvalsRef.doc(emojiEvalFirestoreDocId);
    emojiEvalsDocRef.get().then((doc) => {
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
