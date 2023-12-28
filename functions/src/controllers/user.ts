import {Express} from "express";
import {UserLogic} from "../models/bizlogic/userLogic";
import {IUser} from "../models/serverTslDef";
import {TslLogUtil} from "../utils/tslLogUtil";

const userLogic = new UserLogic();

/**
 * implements URL related to user or authentication
 * @param app 
 */
export const addUserRouting = ((app: Express): void => {

  const URL_PREFIX = "/user";

  app.get(URL_PREFIX + "/create", function(req, res, next) {
    res.render("pages/user/create", {user: userLogic.getLoggedInUser()});
  });
  app.post(URL_PREFIX + "/create", function(req, res, next) {
    TslLogUtil.debug("req : " + req);
    TslLogUtil.debug("req.params : " + req.params);
    TslLogUtil.debug("req.body : " + JSON.stringify(req.body));
    TslLogUtil.debug("req.body.userName : " + req.body.userName);
    TslLogUtil.debug("req.body.iconImage : " + req.body.iconImage);
    TslLogUtil.debug("req.body.selfIntro : " + req.body.selfIntro);
    TslLogUtil.debug("req.body.xProfileURL : " + req.body.xProfileURL);
    TslLogUtil.debug("req.body.instaProfileURL : " + req.body.instaProfileURL);

    const newUser: IUser = {
      id: "1",
      userName: req.body.userName,
      iconUrl: "/images/user-icon/kkrn_icon_user_9.svg",
      selfIntroduction: req.body.selfIntro,
      twitterProfileLink: req.body.xProfileURL,
      instagramProfileLink: req.body.instaProfileURL,
    };
    userLogic.createUser(newUser);
    userLogic.setLoggedInUser(newUser);
    res.render("pages/user/my-page", {user: userLogic.getLoggedInUser(), toast: false});
  });
  app.get(URL_PREFIX + "/login", function(req, res, next) {
    const toast = req.query.toast != undefined;
    res.render("pages/user/login", {user: userLogic.getLoggedInUser(), toast: toast});
  });
  app.post(URL_PREFIX + "/login", function(req, res, next) {
    const user = userLogic.findUser("1");
    if ( user !== null ) {
      userLogic.setLoggedInUser(user);
      res.redirect(URL_PREFIX + "/my-page?toast");
    } else {
      // not found
      res.render("pages/404");
    }
  });
  app.post(URL_PREFIX + "/login2", function(req, res, next) {
    const oneDayMilliSeconds = 24 * 60 * 60 * 1000;
    res.cookie('uid', req.body.uid, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});
    res.cookie('token', req.body.token, {maxAge: oneDayMilliSeconds, httpOnly: true, path: "/"});

    const user = userLogic.findUser("1");
    if ( user !== null ) {
      userLogic.setLoggedInUser(user);
      res.redirect(URL_PREFIX + "/my-page?toast");
    } else {
      // not found
      res.render("pages/404", {user: userLogic.getLoggedInUser()});
    }
  });
  app.get(URL_PREFIX + "/my-page", function(req, res, next) {
    const toast = req.query.toast != undefined;
    res.render("pages/user/my-page", {user: userLogic.getLoggedInUser(), toast: toast});
  });
  app.get(URL_PREFIX + "/update", function(req, res, next) {
    res.render("pages/user/update", {user: userLogic.getLoggedInUser()});
  });
  app.post(URL_PREFIX + "/logout", function(req, res, next) {
    userLogic.logout();
    res.redirect(URL_PREFIX + "/login?toast");
  });
});
