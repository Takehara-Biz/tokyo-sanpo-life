import { Express } from "express";
import { userLogic } from "../../models/bizlogic/userBizLogic";
import { FirebaseAuthManager, firebaseAuthManager } from "../../models/auth/firebaseAuthManager";
import { ReqLogUtil } from "../../utils/reqLogUtil";
import { CtrlUtil } from "../ctrlUtil";
import { TSLThreadLocal } from "../../utils/tslThreadLocal";

/**
 * implements URL related to authentication
 * @param app 
 */
export const addAuthRouting = ((app: Express): void => {

  const EJS_PREFIX = "pages/users/"
  const URL_PREFIX = "/users/";
  const oneDayMilliSeconds = 24 * 60 * 60 * 1000;

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
    
    //res.cookie('uid', req.body.uid, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    //res.cookie('token', req.body.token, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    res.cookie(FirebaseAuthManager.ID_TOKEN_COOKIE_KEY, req.body.idToken, 
      { maxAge: oneDayMilliSeconds, path: "/", httpOnly: true, secure: true });
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

  app.post(URL_PREFIX + "logout", function (req, res, next) {
    userLogic.logout();

    const resCookie1 = "res.cookie1: " + res.get('Set-Cookie');
  ReqLogUtil.debug(resCookie1);
    res.clearCookie(FirebaseAuthManager.ID_TOKEN_COOKIE_KEY);
    const resCookie2 = "res.cookie2: " + res.get('Set-Cookie');
  ReqLogUtil.debug(resCookie2);

    res.redirect(URL_PREFIX + "login?successfulLogoutToast");
  });
});
