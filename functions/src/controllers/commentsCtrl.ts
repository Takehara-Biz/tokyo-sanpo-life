import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { CommentDto } from "../models/dto/commentDto";
import { commentBizLogic } from "../models/bizlogic/commentBizLogic";

/**
 * implements URL related to "comments" pages.
 * @param app 
 */
export const addCommentsRouting = ((app: Express): void => {
  const URL_PREFIX = "/posts/:postId/comments"

  app.post(URL_PREFIX, async function (req, res, next) {
    const now = new Date();
    const newComment : CommentDto = {
      postFirestoreDocId: req.params.postId,
      userFirestoreDocId: "fill in biz Logic...",
      comment: req.body.comment,
      insertedAt: now,
      updatedAt: now
    } 
    await commentBizLogic.create(newComment);
    res.redirect("/posts/" + req.params.postId + "?showBack=false")
  });

  /**
   * called with Ajax
   */
  app.delete(URL_PREFIX + "/:commentId", function (req, res, next) {
    try {
      postLogic.delete(req.params.commentId!.toString());
    } catch (error) {
      ReqLogUtil.warn('failed to delete the post ' + req.params.commentId);
      ReqLogUtil.warn(error);
      throw new Error('no permission!');
    }
    res.json({});
  });
});