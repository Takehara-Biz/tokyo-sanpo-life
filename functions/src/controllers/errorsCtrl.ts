import { Express } from "express";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { CtrlUtil } from "./ctrlUtil";
import { ErrorRequestHandler, Request, Response, NextFunction} from "express";

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
    CtrlUtil.render(res, EJS_PREFIX + "500", {errorMessage: "テスト用"});
  });

  //. 500 エラーが発生した場合、
  app.use( function( err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction ){
    ReqLogUtil.error('HTTP 500 error occurred! ' + err);
    res.status( 500 ); //. 500 エラー
    CtrlUtil.render(res, EJS_PREFIX + "500", {errorMessage: "何度試してもうまくいかない時は、お手数ですが、Xで管理者にDMを送って欲しいです。スクリーンショットがあるとありがたいです。"});
  });

  app.all("*", (req, res) => {
    ReqLogUtil.warn('non-registered url ' + req.url);
    CtrlUtil.render(res, EJS_PREFIX + "404");
  });
});
export const EJS_401_PAGE_PATH = "pages/errors/401";
export const EJS_403_PAGE_PATH = "pages/errors/403";
export const EJS_404_PAGE_PATH = "pages/errors/404";
export const EJS_500_PAGE_PATH = "pages/errors/500";
