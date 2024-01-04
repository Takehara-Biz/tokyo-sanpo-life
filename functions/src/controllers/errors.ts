import { Express } from "express";
import { TslLogUtil } from "../utils/tslLogUtil";
import { CtrlUtil } from "./ctrlUtil";

/**
 * implements URL related to error pages.
 * This function must be called at last to support * well.
 * @param app 
 */
export const addErrorsRouting = ((app: Express): void => {
  const EJS_PREFIX = 'pages/errors/';
  const URL_PREFIX = '/errors/';

  app.get(URL_PREFIX + "401", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "401");
  });

  app.get(URL_PREFIX + "500", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "500");
  });

  app.all("*", (req, res) => {
    TslLogUtil.warn(req.url);
    CtrlUtil.render(res, EJS_PREFIX + "404");
  });
});
export const EJS_401_PAGE_PATH = "pages/errors/401";
export const EJS_403_PAGE_PATH = "pages/errors/403";
export const EJS_404_PAGE_PATH = "pages/errors/404";
export const EJS_500_PAGE_PATH = "pages/errors/500";
