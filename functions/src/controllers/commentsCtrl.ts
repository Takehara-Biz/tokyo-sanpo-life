import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { TSLThreadLocal } from "../utils/tslThreadLocal";
import { PostDto } from "../models/dto/postDto";
import { PostCategory } from "../models/postCategory";

/**
 * implements URL related to "comments" pages.
 * @param app 
 */
export const addCommentsRouting = ((app: Express): void => {
  const URL_PREFIX = "/posts/:id/comments"

  app.post(URL_PREFIX, async function (req, res, next) {
    
    const postId = await postLogic.create(newPost);
    res.redirect("/posts/" + postId + "?showBack=false")
  });

  /**
   * called with Ajax
   */
  app.delete(URL_PREFIX + "/:id", function (req, res, next) {
    // needs authorization
    try {
      postLogic.delete(req.params.id!.toString());
    } catch (error) {
      ReqLogUtil.warn('failed to delete the post ' + req.params.id);
      ReqLogUtil.warn(error);
      throw new Error('no permission!');
    }
    res.json({});
  });
});