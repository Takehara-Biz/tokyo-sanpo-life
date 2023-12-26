import {Express} from "express";
import {UserLogic} from "../models/bizlogic/userLogic";
const userLogic = new UserLogic();

/**
 * implements URL related to "others" pages.
 * @param app 
 */
export const addOthersRouting = ((app: Express): void => {

  app.get("/others", function(req, res, next) {
    res.render("pages/others", {user: userLogic.getLoggedInUser()});
  });
  app.get("/others/about", function(req, res, next) {
    res.render("pages/others/about", {user: userLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/developer", function(req, res, next) {
    res.render("pages/others/developer", {user: userLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/tech", function(req, res, next) {
    res.render("pages/others/tech", {user: userLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/terms-of-service", function(req, res, next) {
    res.render("pages/others/terms-of-service", {user: userLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/privacy-policy", function(req, res, next) {
    res.render("pages/others/privacy-policy", {user: userLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/cookie-policy", function(req, res, next) {
    res.render("pages/others/cookie-policy", {user: userLogic.getLoggedInUser(), showBack: true});
  });
});
