import { Express } from "express";
import { userLogic } from "../models/bizlogic/userLogic";
import { IUser } from "../models/serverTslDef";
import { firebaseAuthDao } from "../models/dao/firebaseAuthDao";
import { defaultUserIconBase64 } from "../models/dao/defaultUserIconBase64";

/**
 * implements URL related to user or authentication
 * @param app 
 */
export const addUserRouting = ((app: Express): void => {

  const URL_PREFIX = "/user";

  app.get(URL_PREFIX + "/create", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.cookies.idToken);
    res.render("pages/user/create", { user: userLogic.getLoggedInUser(), firebaseUserId: firebaseUserId});
  });
  app.post(URL_PREFIX + "/create", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.cookies.idToken);

    const newUser: IUser = {
      id: firebaseUserId!,
      userName: req.body.userName,
      userIconBase64: defaultUserIconBase64,
      selfIntroduction: req.body.selfIntro ?? "",
      twitterProfileLink: req.body.xProfileURL ?? "",
      instagramProfileLink: req.body.instaProfileURL ?? "",
    };
    userLogic.createUser(newUser);
    userLogic.setLoggedInUser(newUser);
    res.render("pages/user/my-page", { user: userLogic.getLoggedInUser(), toast: false });
  });

  app.get(URL_PREFIX + "/login", function (req, res, next) {
    const successfulLogoutToast = req.query.successfulLogoutToast != undefined;
    res.render("pages/user/login", { user: userLogic.getLoggedInUser(), successfulLogoutToast: successfulLogoutToast });
  });
  app.post(URL_PREFIX + "/login", function (req, res, next) {
    const user = userLogic.findUser("1");
    if (user !== null) {
      userLogic.setLoggedInUser(user);
      res.redirect(URL_PREFIX + "/my-page?toast");
    } else {
      // not found
      res.render("pages/404");
    }
  });

  app.post(URL_PREFIX + "/login2", async function (req, res, next) {
    const firebaseUserId = await firebaseAuthDao.verifyIdToken(req.body.idToken);
    if (firebaseUserId == null) {
      // unauthorized
      res.render("pages/401", { user: userLogic.getLoggedInUser() });
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
    res.render("pages/user/my-page", { user: userLogic.getLoggedInUser(), toast: toast });
  });

  app.get(URL_PREFIX + "/update-user-icon", function (req, res, next) {
    res.render("pages/user/update-user-icon", { user: userLogic.getLoggedInUser() });
  });

  app.post(URL_PREFIX + "/update-user-icon", function (req, res, next) {
    res.redirect(URL_PREFIX + "/my-page");
  });

  app.get(URL_PREFIX + "/update", function (req, res, next) {
    res.render("pages/user/update", { user: userLogic.getLoggedInUser() });
  });
  app.put(URL_PREFIX + "/update", function (req, res, next) {
    // todo!
    res.redirect(URL_PREFIX + "/my-page");
  });

  app.post(URL_PREFIX + "/logout", function (req, res, next) {
    userLogic.logout();
    res.redirect(URL_PREFIX + "/login?successfulLogoutToast");
  });
});
