import { Express, Request, Response, NextFunction } from "express";
import { firebaseAuthDao } from "../models/auth/firebaseAuthDao";
import { userLogic } from "../models/bizlogic/userBizLogic";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { TSLThreadLocal } from "../utils/tslThreadLocal";

export const addMiddleware = ((app: Express): void => {
  /**
 * for local thread
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  console.debug('for local thread');
  await TSLThreadLocal.storage.run(
    new TSLThreadLocal(),
    async () => {
      await next();
    },
  );
});

/**
 * for logging
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  console.debug('for logging');
  ReqLogUtil.info("[BEGIN] " + req.method + " " + req.url + ",\nreq.params=" + JSON.stringify(req.params) + ",\nreq.body=" + JSON.stringify(req.body));

  const reqCookies = "req.cookies=" + JSON.stringify(req.cookies);
  ReqLogUtil.debug(reqCookies.substring(0, 100));
  await next();
  ReqLogUtil.info("[  END] " + req.method + " " + req.url);

  const resCookie = "res.cookie=" + res.get('Set-Cookie');
  ReqLogUtil.debug(resCookie.substring(0, 100));
});

/**
 * for auth
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  console.debug('for auth');
  const idToken = req.cookies['idToken'];
  if (idToken != null) {
    ReqLogUtil.debug('request has the "idToken" in the cookie!');
    const uid = await firebaseAuthDao.verifyIdToken(idToken);
    if (uid != null) {
      const user = await userLogic.findUser(uid);
      TSLThreadLocal.currentContext.identifiedFirebaseUserId = uid;
      if (user != null) {
        if (user.loggedIn) {
          ReqLogUtil.debug('already logged in user!');
          TSLThreadLocal.currentContext.loggedInUser = user;
        } else {
          ReqLogUtil.debug('This user has not log in yet.');
        }
      } else {
        ReqLogUtil.debug('This user has not created the TSL account yet.');
      }
    } else {
      ReqLogUtil.warn('invalid uid... maybe Firebase ID token has been expired.');
    }
  } else {
    ReqLogUtil.debug('request does NOT have the "idToken" in the cookie...');
  }

  ReqLogUtil.debug('threadLocal.identifiedFirebaseUserId : ' + TSLThreadLocal.currentContext.identifiedFirebaseUserId);
  ReqLogUtil.debug('threadLocal.loggedInUser : ' + TSLThreadLocal.currentContext.loggedInUser);

  await next();
});
});