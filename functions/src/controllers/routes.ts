import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { addUsersRouting } from "./routes/usersCtrl";
import { addOthersRouting } from "./routes/othersCtrl";
import { addErrorsRouting } from "./routes/errorsCtrl";
import { addPostsRouting } from "./routes/postsCtrl";
import { addPostsEmojiEvalsRouting } from "./routes/postsEmojiEvalsCtrl";
import { CtrlUtil } from "./ctrlUtil";
import { addCommentsRouting } from "./routes/commentsCtrl";
import { addAuthRouting } from "./routes/authCtrl";

export const routing = ((app: Express): void => {

  app.get("/how-to-use", function (req, res, next) {
    CtrlUtil.render(res, "pages/how-to-use");
  });

  app.get("/map", async function (req, res, next) {
    
    // TODO このコードは違う。
    // mapのページを初期表示するのと、mapの表示状態に応じて、マーカー一覧をダウンロードするHTTPのAPIは分けるべき。
    // マーカー一覧をダウンロードする方は、ajaxで呼び出される想定。
    const targetPosts = await postLogic.listOrderbyInsertedAtDesc();
    CtrlUtil.render(res, "pages/map", {targetPosts: targetPosts});
  });

  app.get("/add-record", function (req, res, next) {
    CtrlUtil.render(res, "pages/add-record");
  });

  addUsersRouting(app);
  addAuthRouting(app);
  addPostsRouting(app);
  addCommentsRouting(app);
  addPostsEmojiEvalsRouting(app);
  addOthersRouting(app);

  // this must be called at last definitely!
  addErrorsRouting(app);
});