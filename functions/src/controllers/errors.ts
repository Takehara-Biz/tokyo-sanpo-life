import {Express} from "express";
import {UserLogic} from "../models/bizlogic/userLogic";
import { TslLogUtil } from "../utils/tslLogUtil";
const userLogic = new UserLogic();

/**
 * implements URL related to error pages.
 * This function must be called at last to support * well.
 * @param app 
 */
export const addErrorsRouting = ((app: Express): void => {

  app.get("/401", function(req, res, next) {
    res.render("pages/401", {user: userLogic.getLoggedInUser()});
  });

  app.get("/500", function(req, res, next) {
    res.render("pages/500", {user: userLogic.getLoggedInUser()});
  });

  app.all("*", (req, res) => {
    TslLogUtil.warn(req.url);
    res.render("pages/404", {user: userLogic.getLoggedInUser()});
  });
});
