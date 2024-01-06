import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { TSLThreadLocal } from "../utils/tslThreadLocal";
import { CtrlUtil } from "./ctrlUtil";
import { emojiEvalBizLogic } from "../models/bizlogic/emojiEvalBizLogic";
import { EmojiEvalDto } from "../models/dto/emojiEvalDto";

/**
 * implements URL related to "posts/:id/emojiEvals" pages.
 * @param app 
 */
export const addPostsEmojiEvalsRouting = ((app: Express): void => {
  const URL_PREFIX = "/posts/:id/emojiEvals"

  app.get(URL_PREFIX, async function (req, res, next) {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId ?? null;
    const unicode_count_userPut = postLogic.findEmojiEvals(req.params.id as string, firebaseUserId);
    const alreadyLoggedIn = TSLThreadLocal.currentContext.loggedInUser != undefined;
    CtrlUtil.render(res, "partials/util/emoji-evaluation-count-section", {unicode_count_userPut: unicode_count_userPut, alreadyLoggedIn: alreadyLoggedIn});
  });

  /**
   * call with Ajax
   */
  app.post(URL_PREFIX, function (req, res, next) {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId ?? null;
    const postId = req.params.id;
    const now = new Date();
    const emojiEval : EmojiEvalDto = {
      postFirestoreDocId: postId,
      userFirestoreDocId: firebaseUserId!,
      unicode: req.body.unicode,
      insertedAt: now,
      updatedAt: now,
    }
    emojiEvalBizLogic.create(emojiEval);
    res.json({});
  });

  /**
   * call with Ajax
   */
  app.delete(URL_PREFIX + "/:emojiEvalFirestoreDocId", function (req, res, next) {
    emojiEvalBizLogic.delete(req.params.emojiEvalFirestoreDocId);
    res.redirect("/posts/" + req.params.id + "/emojiEvals");
  });
});