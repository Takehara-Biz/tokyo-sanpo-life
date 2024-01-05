import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { addUsersRouting } from "./usersCtrl";
import { addOthersRouting } from "./othersCtrl";
import { addErrorsRouting } from "./errorsCtrl";
import { addPostsRouting } from "./postsCtrl";
import { addPostsEmojiEvalulationsRouting } from "./postsEmojiEvaluationsCtrl";
import { CtrlUtil } from "./ctrlUtil";

export const routing = ((app: Express): void => {

  app.get("/how-to-use", function (req, res, next) {
    CtrlUtil.render(res, "pages/how-to-use");
  });

  app.get("/map", function (req, res, next) {
    
    // TODO このコードは違う。
    // mapのページを初期表示するのと、mapの表示状態に応じて、マーカー一覧をダウンロードするHTTPのAPIは分けるべき。
    // マーカー一覧をダウンロードする方は、ajaxで呼び出される想定。
    const targetPosts = postLogic.listOrderbyInsertedAtDesc();
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