import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { addUsersRouting } from "./usersCtrl";
import { addOthersRouting } from "./othersCtrl";
import { addErrorsRouting } from "./errorsCtrl";
import { addPostsRouting } from "./posts";
import { addPostsEmojiEvalulationsRouting } from "./postsEmojiEvaluationsCtrl";
import { CtrlUtil } from "./ctrlUtil";

export const routing = ((app: Express): void => {

  app.get("/how-to-use", function (req, res, next) {
    CtrlUtil.render(res, "pages/how-to-use");
  });

  app.get("/map", function (req, res, next) {
    const targetPosts = postLogic.findPosts();
    CtrlUtil.render(res, "pages/map", {targetPosts: targetPosts});
  });

  app.get("/add-record", function (req, res, next) {
    CtrlUtil.render(res, "pages/add-record");
  });

  addUsersRouting(app);
  addPostsRouting(app);
  addPostsEmojiEvalulationsRouting(app);
  addOthersRouting(app);

  // this must be called at last definitely!
  addErrorsRouting(app);
});