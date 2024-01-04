import { Express } from "express";
import { userLogic } from "../models/bizlogic/userLogic";
import { IUser } from "../models/serverTslDef";
import { firebaseAuthDao } from "../models/auth/firebaseAuthDao";
import { defaultUserIconBase64 } from "../models/dao/defaultUserIconBase64";
import { EJS_401_PAGE_PATH } from "./errors";
import { TslLogUtil } from "../utils/tslLogUtil";
import { CtrlUtil } from "./ctrlUtil";
import { TSLThreadLocal } from "../utils/tslThreadLocal";

/**
 * implements URL related to user or authentication
 * @param app 
 */
export const addUsersRouting = ((app: Express): void => {

  const EJS_PREFIX = "pages/users/"
  const URL_PREFIX = "/users/";

  app.get(URL_PREFIX + "create", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.cookies.idToken);
    CtrlUtil.render(res, EJS_PREFIX + "create", {firebaseUserId: firebaseUserId});
  });
  app.post(URL_PREFIX + "create", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.cookies.idToken);
    const newUser: IUser = {
      id: firebaseUserId!,
      userName: req.body.userName,
      userIconBase64: defaultUserIconBase64,
      selfIntroduction: req.body.selfIntroduction ?? "",
      xProfileLink: req.body.xProfileURL ?? "",
      instagramProfileLink: req.body.instaProfileURL ?? "",
    };
    userLogic.createUser(newUser);
    userLogic.setLoggedInUser(TSLThreadLocal.currentContext.identifiedFirebaseUserId!, newUser);
    res.redirect(URL_PREFIX + "my-page");
  });

  app.get(URL_PREFIX + "login", function (req, res, next) {
    const successfulLogoutToast = req.query.successfulLogoutToast != undefined;
    CtrlUtil.render(res, EJS_PREFIX + "login", { successfulLogoutToast: successfulLogoutToast });
  });
  app.post(URL_PREFIX + "login", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.body.idToken);
    if (firebaseUserId == null) {
      TslLogUtil.warn('unauthorized!');
      //res.render(EJS_401_PAGE_PATH, { user: userLogic.getLoggedInUser() });
      res.redirect("errors/401");
      return;
    }

    const oneDayMilliSeconds = 24 * 60 * 60 * 1000;
    //res.cookie('uid', req.body.uid, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    //res.cookie('token', req.body.token, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    res.cookie('idToken', req.body.idToken, { maxAge: oneDayMilliSeconds, httpOnly: true, path: "/" });


    const user = userLogic.findUser(firebaseUserId!);
    if (user !== null) {
      userLogic.setLoggedInUser(firebaseUserId, user);
      res.redirect(URL_PREFIX + "my-page?toast");
    } else {
      // not found, must be registered at first!
      res.redirect(URL_PREFIX + "create");
    }
  });

  app.get(URL_PREFIX + "my-page", function (req, res, next) {
    const toast = req.query.toast != undefined;
    CtrlUtil.render(res, EJS_PREFIX + "my-page", { toast: toast });
  });

  app.get(URL_PREFIX + "update-user-icon", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "update-user-icon");
  });

  app.post(URL_PREFIX + "update-user-icon", function (req, res, next) {
    res.redirect(URL_PREFIX + "my-page");
  });

  app.get(URL_PREFIX + "update", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "update");
  });
  /**
   * called with Ajax
   */
  app.put(URL_PREFIX + ":id", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.body.idToken);
    if(req.params.id != firebaseUserId){
      CtrlUtil.render(res, EJS_401_PAGE_PATH);
      return;
    }

    const user = userLogic.findUser(firebaseUserId!);
    user!.userName = req.body.userName,
    user!.selfIntroduction = req.body.selfIntroduction ?? "",
    user!.xProfileLink = req.body.xProfileURL ?? "",
    user!.instagramProfileLink = req.body.instaProfileURL ?? "",
    userLogic.updateUser(user!);
    userLogic.setLoggedInUser(firebaseUserId!, user!);
    firebaseUserId
    CtrlUtil.render(res, EJS_PREFIX + "my-page", { toast: false });
  });

  app.post(URL_PREFIX + "logout", function (req, res, next) {
    userLogic.logout();
    res.clearCookie('idToken');
    res.redirect(URL_PREFIX + "login?successfulLogoutToast");
  });

  /**
   * called with Ajax
   */
  app.delete(URL_PREFIX + ":id", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.body.idToken);
    if(req.params.id != firebaseUserId){
      CtrlUtil.render(res, EJS_401_PAGE_PATH);
      return;
    }
    userLogic.deleteUser(firebaseUserId);
    userLogic.logout();
    CtrlUtil.render(res, EJS_PREFIX + "my-page", { toast: true });
  });
});
