import { Express } from "express";
import { userLogic } from "../models/bizlogic/userLogic";
import { TslLogUtil } from "../utils/tslLogUtil";

/**
 * implements URL related to error pages.
 * This function must be called at last to support * well.
 * @param app 
 */
export const addErrorsRouting = ((app: Express): void => {
  const EJS_PREFIX = 'pages/errors/';
  const URL_PREFIX = '/errors/';

  app.get(URL_PREFIX + "401", function (req, res, next) {
    res.render(EJS_PREFIX + "401", { user: userLogic.getLoggedInUser() });
  });

  app.get(URL_PREFIX + "500", function (req, res, next) {
    res.render(EJS_PREFIX + "500", { user: userLogic.getLoggedInUser() });
  });

  app.all("*", (req, res) => {
    TslLogUtil.warn(req.url);
    res.render(EJS_PREFIX + "404", { user: userLogic.getLoggedInUser() });
  });
});
export const EJS_404_PAGE_PATH = "pages/errors/404";
export const EJS_500_PAGE_PATH = "pages/errors/500";
