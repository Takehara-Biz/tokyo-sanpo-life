import {Express} from "express";
import {UserLogic} from "../models/bizlogic/userLogic";
import {IUser} from "../models/serverTslDef";
import {TslLogUtil} from "../utils/tslLogUtil";

const userLogic = new UserLogic();

/**
 * set URL for user and authentication
 * @param app 
 */
export const addUserRouting = ((app: Express): void => {
  
  app.get("/create-account", function(req, res, next) {
    res.render("pages/create-account", {user: userLogic.getLoggedInUser()});
  });
  app.post("/create-account", function(req, res, next) {
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
    res.render("pages/my-page", {user: userLogic.getLoggedInUser(), toast: false});
  });
  app.get("/login", function(req, res, next) {
    const toast = req.query.toast != undefined;
    res.render("pages/login", {user: userLogic.getLoggedInUser(), toast: toast});
  });
  app.post("/login", function(req, res, next) {
    const user = userLogic.findUser("1");
    if ( user !== null ) {
      userLogic.setLoggedInUser(user);
      res.redirect("/my-page?toast");
    } else {
      // not found
      res.render("pages/404");
    }
  });
  app.get("/my-page", function(req, res, next) {
    const toast = req.query.toast != undefined;
    res.render("pages/my-page", {user: userLogic.getLoggedInUser(), toast: toast});
  });
  app.post("/logout", function(req, res, next) {
    userLogic.logout();
    res.redirect("/login?toast");
  });
});
