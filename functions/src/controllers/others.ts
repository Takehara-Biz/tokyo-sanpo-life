import { Express } from "express";
import { userLogic } from "../models/bizlogic/userLogic";

/**
 * implements URL related to "others" pages.
 * @param app 
 */
export const addOthersRouting = ((app: Express): void => {
  const EJS_PREFIX = "pages/others";
  const URL_PREFIX = "/others";

  app.get(URL_PREFIX, function (req, res, next) {
    res.render(EJS_PREFIX, { user: userLogic.getLoggedInUser() });
  });
  app.get(URL_PREFIX + "/about", function (req, res, next) {
    res.render(EJS_PREFIX + "/about", { user: userLogic.getLoggedInUser(), showBack: true });
  });
  app.get(URL_PREFIX + "/developer", function (req, res, next) {
    res.render(EJS_PREFIX + "/developer", { user: userLogic.getLoggedInUser(), showBack: true });
  });
  app.get(URL_PREFIX + "/tech", function (req, res, next) {
    res.render(EJS_PREFIX + "/tech", { user: userLogic.getLoggedInUser(), showBack: true });
  });
  app.get(URL_PREFIX + "/terms-of-service", function (req, res, next) {
    res.render(EJS_PREFIX + "/terms-of-service", { user: userLogic.getLoggedInUser(), showBack: true });
  });
  app.get(URL_PREFIX + "/privacy-policy", function (req, res, next) {
    res.render(EJS_PREFIX + "/privacy-policy", { user: userLogic.getLoggedInUser(), showBack: true });
  });
  app.get(URL_PREFIX + "/cookie-policy", function (req, res, next) {
    res.render(EJS_PREFIX + "/cookie-policy", { user: userLogic.getLoggedInUser(), showBack: true });
  });
});
