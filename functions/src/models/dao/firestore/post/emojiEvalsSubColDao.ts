import { ReqLogUtil } from "../../../../utils/reqLogUtil";
import { FirebaseAdminManager } from "../../../firebase/firebaseAdminManager";
import { EmojiEvalDoc } from "../../doc/post/emojiEvalsDoc";
import { IEmojiEvalsDao } from "../../interface/iEmojiEvalsDao";
import { PostsColDao } from "../postsColDao";

export class EmojiEvalsSubColDao implements IEmojiEvalsDao {
  private static readonly SUB_COL_NAME = "emojiEvals";

  async read(postId: string, userId: string, unicode: string): Promise<EmojiEvalDoc | null> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvaluationsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    const snapshot = await emojiEvaluationsRef.where('unicode', '==', unicode).where('userFirestoreDocId', '==', userId).get();
    let result = null;
    await snapshot.forEach((doc) => {
      result = doc.data() as EmojiEvalDoc;
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(result));
      result.firestoreDocId = doc.id;
    });

    ReqLogUtil.debug('read result : ' + ReqLogUtil.jsonStr(result));
    return result;
  }

  async count(postId: string, userId:string): Promise<number> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvaluationsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    const snapshot = await emojiEvaluationsRef.where('userFirestoreDocId', '==', userId).count().get();
    return snapshot.data().count
  }

  async create(postId: string, emojiEvalDoc: EmojiEvalDoc): Promise<void> {
    ReqLogUtil.info('createEmojiEval : ' + ReqLogUtil.jsonStr(emojiEvalDoc));

    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvalsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    await emojiEvalsRef.add(emojiEvalDoc);
  }

  async list(postId: string): Promise<EmojiEvalDoc[]> {
    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvaluationsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    const emojiEvaluationsSnapshot = await emojiEvaluationsRef.get();
    const emojiEvaluationDocs: EmojiEvalDoc[] = [];
    emojiEvaluationsSnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //ReqLogUtil.debug(doc.id + " => " + doc.data());
      const emojiEvaluationDoc = doc.data() as EmojiEvalDoc;
      emojiEvaluationDoc.firestoreDocId = doc.id;
      emojiEvaluationDocs.push(emojiEvaluationDoc);
    });
    ReqLogUtil.debug('list emoji eval length : ' + emojiEvaluationDocs.length);
    return emojiEvaluationDocs;
  }

  async delete(postId: string, userId: string, unicode: string): Promise<void> {
    ReqLogUtil.info(`deleteEmojiEval postId:${postId}, unicode:${unicode}`);

    const postsRef = FirebaseAdminManager.db.collection(PostsColDao.COL_NAME);
    const postsDocRef = await postsRef.doc(postId);

    const emojiEvalsRef = postsDocRef.collection(EmojiEvalsSubColDao.SUB_COL_NAME);
    const emojiEvalsSnapshot = await emojiEvalsRef.where('unicode', '==', unicode).where('userFirestoreDocId', '==', userId).get();
    emojiEvalsSnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      ReqLogUtil.debug(doc.id + " => " + ReqLogUtil.jsonStr(doc.data()));
      await doc.ref.delete();
    });
  }
}
