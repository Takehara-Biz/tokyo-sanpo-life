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
  const URL_PREFIX = "/posts/:postId/emojiEvals"

  app.get(URL_PREFIX, async function (req, res, next) {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId ?? null;
    const unicode_count_userPut = await postLogic.findEmojiEvals(req.params.postId, firebaseUserId);
    const alreadyLoggedIn = TSLThreadLocal.currentContext.loggedInUser != undefined;
    CtrlUtil.render(res, "partials/util/emoji-eval-count-section", {unicode_count_userPut: unicode_count_userPut, alreadyLoggedIn: alreadyLoggedIn});
  });

  /**
   * call with Ajax
   */
  app.post(URL_PREFIX, function (req, res, next) {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId ?? null;
    const now = new Date();
    const emojiEvalDto : EmojiEvalDto = {
      userFirestoreDocId: firebaseUserId!,
      unicode: req.body.unicode,
      insertedAt: now,
      updatedAt: now,
    }
    emojiEvalBizLogic.create(req.params.postId, emojiEvalDto);
    res.json({});
  });

  /**
   * call with Ajax
   */
  app.delete(URL_PREFIX + "/:unicode", function (req, res, next) {
    emojiEvalBizLogic.delete(req.params.postId, req.params.unicode);
    res.redirect("/posts/" + req.params.postId + "/emojiEvals");
  });
});