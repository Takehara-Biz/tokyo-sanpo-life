import { Express } from "express";
import { userLogic } from "../../models/bizlogic/userBizLogic";
import { FirebaseAuthManager, firebaseAuthManager } from "../../models/auth/firebaseAuthManager";
import { EJS_401_PAGE_PATH } from "./errorsCtrl";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { CtrlUtil } from "../ctrlUtil";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";
import { UserDto } from "../../models/dto/userDto";

/**
 * implements URL related to user except authentication
 * @param app 
 */
export const addUsersRouting = ((app: Express): void => {

  const EJS_PREFIX = "pages/users/"
  const URL_PREFIX = "/users/";

  app.get(URL_PREFIX + "create", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthManager.verifyIdToken(req.cookies.__session);
    CtrlUtil.render(res, EJS_PREFIX + "create", {firebaseUserId: firebaseUserId});
  });
  app.post(URL_PREFIX + "create", async function (req, res, next) {
    const firebaseUserId = TSLThreadLocal.currentContext.identifiedFirebaseUserId;
    const now = new Date();
    const newUser: UserDto = {
      firebaseUserId: firebaseUserId!,
      loggedIn: true,
      userName: req.body.userName,
      userIconUrl: "set in biz logic",
      selfIntroduction: req.body.selfIntroduction ?? "",
      xProfileLink: req.body.xProfileURL ?? "",
      instagramProfileLink: req.body.instaProfileURL ?? "",
      insertedAt: now,
      updatedAt: now,
    };
    await userLogic.createUser(newUser);
    TSLThreadLocal.currentContext.loggedInUser = newUser;
    res.redirect(URL_PREFIX + "my-page");
  });

  app.get(URL_PREFIX + "my-page", function (req, res, next) {
    const toast = req.query.toast != undefined;
    CtrlUtil.render(res, EJS_PREFIX + "my-page", { toast: toast });
  });

  app.get(URL_PREFIX + "update-user-icon", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "update-user-icon", {showBack: true});
  });

  /**
   * called with Ajax
   */
  app.put(URL_PREFIX + ":id/icon", async function (req, res, next) {
    const result = await userLogic.updateUserIcon(req.params.id, req.body.newUserIconBase64);
    ReqLogUtil.debug('result : ' + result);
    res.json({});
  });

  app.get(URL_PREFIX + "update", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "update", {showBack: true});
  });
  /**
   * called with Ajax
   */
  app.put(URL_PREFIX + ":id", async function (req, res, next) {
    const user = await userLogic.findUser(req.body.firebaseUserId!);
    if(user == null){
      throw new Error('failed updating');
    }

    user!.userName = req.body.userName,
    user!.selfIntroduction = req.body.selfIntroduction ?? "";
    user!.xProfileLink = req.body.xProfileURL ?? "";
    user!.instagramProfileLink = req.body.instaProfileURL ?? "";
    const result = await userLogic.updateUser(user!);
    if(!result){
      throw new Error('failed updating');
    }
    res.json({});
  });

  app.get(URL_PREFIX + "confirm-delete", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "confirm-delete", {showBack: true});
  });

  /**
   * called with Ajax
   */
  app.delete(URL_PREFIX + ":id", async function (req, res, next) {
    if(! await userLogic.deleteUser(req.params.id)){
      CtrlUtil.render(res, EJS_401_PAGE_PATH);
      return;
    }
    res.clearCookie(FirebaseAuthManager.ID_TOKEN_COOKIE_KEY);
    res.json({});
  });
});
