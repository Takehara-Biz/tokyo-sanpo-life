import { Express } from "express";
import { CtrlUtil } from "./ctrlUtil";

/**
 * implements URL related to "others" pages.
 * @param app 
 */
export const addOthersRouting = ((app: Express): void => {
  const EJS_PREFIX = "pages/others";
  const URL_PREFIX = "/others";

  app.get(URL_PREFIX, function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX);
  });
  app.get(URL_PREFIX + "/about", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "/about", {showBack: true});
  });
  app.get(URL_PREFIX + "/developer", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "/developer", {showBack: true});
  });
  app.get(URL_PREFIX + "/tech", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "/tech", {showBack: true});
  });
  app.get(URL_PREFIX + "/terms-of-service", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "/terms-of-service", {showBack: true});
  });
  app.get(URL_PREFIX + "/privacy-policy", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "/privacy-policy", {showBack: true});
  });
  app.get(URL_PREFIX + "/cookie-policy", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "/cookie-policy", {showBack: true});
  });
});
