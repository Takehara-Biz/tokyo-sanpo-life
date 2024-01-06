import { Express } from "express";
import { userLogic } from "../models/bizlogic/userBizLogic";
import { FirebaseAuthManager, firebaseAuthManager } from "../models/auth/firebaseAuthManager";
import { EJS_401_PAGE_PATH } from "./errorsCtrl";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { CtrlUtil } from "./ctrlUtil";
import { TSLThreadLocal } from "../utils/tslThreadLocal";
import { UserDto } from "../models/dto/userDto";
import { BasicUserIconUtil } from "../models/dao/basicUserIconBase64";

/**
 * implements URL related to user or authentication
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
      userIconBase64: BasicUserIconUtil.defaultUserIconBase64,
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

  app.get(URL_PREFIX + "login", function (req, res, next) {
    const successfulLogoutToast = req.query.successfulLogoutToast != undefined;
    CtrlUtil.render(res, EJS_PREFIX + "login", { successfulLogoutToast: successfulLogoutToast });
  });
  app.post(URL_PREFIX + "login", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthManager.verifyIdToken(req.body.idToken);
    if (firebaseUserId == null) {
      ReqLogUtil.warn('unauthorized!');
      //res.render(EJS_401_PAGE_PATH, { user: userLogic.getLoggedInUser() });
      res.redirect("errors/401");
      return;
    }

    const oneDayMilliSeconds = 24 * 60 * 60 * 1000;
    //res.cookie('uid', req.body.uid, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    //res.cookie('token', req.body.token, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    res.cookie(FirebaseAuthManager.ID_TOKEN_COOKIE_KEY, req.body.idToken, { maxAge: oneDayMilliSeconds, httpOnly: true, path: "/" });
    ReqLogUtil.debug('set idToken into res cookie!');
    const resCookie = "res.cookie=" + res.get('Set-Cookie');
    ReqLogUtil.debug(resCookie.substring(0, 100));

    const user = await userLogic.findUser(firebaseUserId!);

    if (user !== null) {
      user.loggedIn = true;
      await userLogic.updateUser(user);
      TSLThreadLocal.currentContext.loggedInUser = user;
      ReqLogUtil.debug('redirect to my-page');
      res.redirect(URL_PREFIX + "my-page?toast");
    } else {
      // not found, must be registered at first!
      ReqLogUtil.debug('redirect to create');
      res.redirect(URL_PREFIX + "create");
    }
  });

  app.get(URL_PREFIX + "my-page", function (req, res, next) {
    const toast = req.query.toast != undefined;
    CtrlUtil.render(res, EJS_PREFIX + "my-page", { toast: toast });
  });

  app.get(URL_PREFIX + "update-user-icon", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "update-user-icon", {showBack: true});
  });

  app.post(URL_PREFIX + "update-user-icon", async function (req, res, next) {
    const result = await userLogic.updateUserIconBase64(req.body.newUserIconBase64);
    ReqLogUtil.debug('result : ' + result);
    if(result){
      res.redirect(URL_PREFIX + "my-page");
    } else {
      res.redirect('/errors/403');
    }
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

  app.post(URL_PREFIX + "logout", function (req, res, next) {
    userLogic.logout();

    const resCookie1 = "res.cookie1: " + res.get('Set-Cookie');
  ReqLogUtil.debug(resCookie1);
    res.clearCookie(FirebaseAuthManager.ID_TOKEN_COOKIE_KEY);
    const resCookie2 = "res.cookie2: " + res.get('Set-Cookie');
  ReqLogUtil.debug(resCookie2);

    res.redirect(URL_PREFIX + "login?successfulLogoutToast");
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
