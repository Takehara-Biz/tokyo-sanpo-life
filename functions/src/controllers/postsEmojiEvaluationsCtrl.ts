import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { TSLThreadLocal } from "../utils/tslThreadLocal";
import { CtrlUtil } from "./ctrlUtil";

/**
 * implements URL related to "posts/:id/emojiEvaluations" pages.
 * @param app 
 */
export const addPostsEmojiEvalulationsRouting = ((app: Express): void => {
  const URL_PREFIX = "/posts/:id/emojiEvaluations"

  app.get(URL_PREFIX, async function (req, res, next) {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId ?? null;
    const unicode_count_userPut = postLogic.findEmojiEvaluations(req.params.id as string, firebaseUserId);
    const alreadyLoggedIn = TSLThreadLocal.currentContext.loggedInUser != undefined;
    CtrlUtil.render(res, "partials/util/emoji-evaluation-count-section", {unicode_count_userPut: unicode_count_userPut, alreadyLoggedIn: alreadyLoggedIn});
  });

  // パラメータの絵文字を付与する
  app.post(URL_PREFIX + "/:unicode", function (req, res, next) {
    postLogic.putEmojiEvaluation(req.params.id, req.params.unicode, "1");
    res.redirect("/posts/" + req.params.id + "/emojiEvaluations");
  });

  // パラメータの絵文字を解除する
  app.delete(URL_PREFIX + "/:unicode", function (req, res, next) {
    postLogic.removeEmojiEvaluation(req.params.id, req.params.unicode, "1");
    res.redirect("/posts/" + req.params.id + "/emojiEvaluations");
  });
});