import { Express } from "express";
import { userLogic } from "../models/bizlogic/userLogic";
import { IUser } from "../models/serverTslDef";
import { firebaseAuthDao } from "../models/auth/firebaseAuthDao";
import { defaultUserIconBase64 } from "../models/dao/defaultUserIconBase64";
import { EJS_401_PAGE_PATH, EJS_404_PAGE_PATH } from "./errors";

/**
 * implements URL related to user or authentication
 * @param app 
 */
export const addUsersRouting = ((app: Express): void => {

  const EJS_PREFIX = "pages/users/"
  const URL_PREFIX = "/users";

  app.get(URL_PREFIX + "/create", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.cookies.idToken);
    res.render(EJS_PREFIX + "create", { user: userLogic.getLoggedInUser(), firebaseUserId: firebaseUserId});
  });
  app.post(URL_PREFIX + "/create", async function (req, res, next) {
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
    userLogic.setLoggedInUser(newUser);
    res.render(EJS_PREFIX + "my-page", { user: userLogic.getLoggedInUser(), toast: false });
  });

  app.get(URL_PREFIX + "/login", function (req, res, next) {
    const successfulLogoutToast = req.query.successfulLogoutToast != undefined;
    res.render(EJS_PREFIX + "login", { user: userLogic.getLoggedInUser(), successfulLogoutToast: successfulLogoutToast });
  });
  app.post(URL_PREFIX + "/login", function (req, res, next) {
    const user = userLogic.findUser("1");
    if (user !== null) {
      userLogic.setLoggedInUser(user);
      res.redirect(URL_PREFIX + "/my-page?toast");
    } else {
      // not found
      res.render(EJS_404_PAGE_PATH);
    }
  });

  app.post(URL_PREFIX + "/login2", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.body.idToken);
    if (firebaseUserId == null) {
      // unauthorized
      res.render(EJS_401_PAGE_PATH, { user: userLogic.getLoggedInUser() });
      return;
    }

    const oneDayMilliSeconds = 24 * 60 * 60 * 1000;
    //res.cookie('uid', req.body.uid, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    //res.cookie('token', req.body.token, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    res.cookie('idToken', req.body.idToken, { maxAge: oneDayMilliSeconds, httpOnly: true, path: "/" });


    const user = userLogic.findUser(firebaseUserId!);
    if (user !== null) {
      userLogic.setLoggedInUser(user);
      res.redirect(URL_PREFIX + "/my-page?toast");
    } else {
      // not found, must be registered at first!
      res.redirect(URL_PREFIX + "/create");
    }
  });

  app.get(URL_PREFIX + "/my-page", function (req, res, next) {
    const toast = req.query.toast != undefined;
    res.render(EJS_PREFIX + "my-page", { user: userLogic.getLoggedInUser(), toast: toast });
  });

  app.get(URL_PREFIX + "/update-user-icon", function (req, res, next) {
    res.render(EJS_PREFIX + "update-user-icon", { user: userLogic.getLoggedInUser() });
  });

  app.post(URL_PREFIX + "/update-user-icon", function (req, res, next) {
    res.redirect(URL_PREFIX + "/my-page");
  });

  app.get(URL_PREFIX + "/update", function (req, res, next) {
    res.render(URL_PREFIX + "/update", { user: userLogic.getLoggedInUser() });
  });
  /**
   * called with Ajax
   */
  app.put(URL_PREFIX + "/:id", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.body.idToken);
    if(req.params.id != firebaseUserId){
      res.render(EJS_401_PAGE_PATH, { user: userLogic.getLoggedInUser() });
      return;
    }

    const user = userLogic.findUser(firebaseUserId!);
    user!.userName = req.body.userName,
    user!.selfIntroduction = req.body.selfIntroduction ?? "",
    user!.xProfileLink = req.body.xProfileURL ?? "",
    user!.instagramProfileLink = req.body.instaProfileURL ?? "",
    userLogic.updateUser(user!);
    userLogic.setLoggedInUser(user!);
    res.render(EJS_PREFIX + "my-page", { user: userLogic.getLoggedInUser(), toast: false });
  });

  app.post(URL_PREFIX + "/logout", function (req, res, next) {
    userLogic.logout();
    res.redirect(URL_PREFIX + "/login?successfulLogoutToast");
  });
});
