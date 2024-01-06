import { Express, Request, Response, NextFunction } from "express";
import { FirebaseAuthManager, firebaseAuthManager } from "../models/auth/firebaseAuthManager";
import { userLogic } from "../models/bizlogic/userBizLogic";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { TSLThreadLocal } from "../utils/tslThreadLocal";

export const addMiddleware = ((app: Express): void => {
  /**
 * for local thread
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  // For here logging, ReqLogUtil cannot be used yet, due to before set up the thread local.
  console.debug('\n\n[BEGIN] (AOP) Set up the local thread for this https request');
  await TSLThreadLocal.storage.run(
    new TSLThreadLocal(),
    async () => {
      await next();
    },
  );
  console.debug('[  END] (AOP) Set up the local thread for this https request');
});

/**
 * for logging
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  ReqLogUtil.info("[BEGIN] (AOP) Logging : " + req.method + " " + req.url + 
  ",\nreq.query=" + JSON.stringify(req.query) + 
  ",\nreq.params=" + JSON.stringify(req.params) + 
  ",\nreq.body=" + JSON.stringify(req.body));

  const reqCookies = "req.cookies=" + JSON.stringify(req.cookies);
  ReqLogUtil.debug(reqCookies.substring(0, 100));

  await next();

  const resCookie = "res.cookie=" + res.get('Set-Cookie');
  ReqLogUtil.debug(resCookie.substring(0, 100));

  ReqLogUtil.debug("[  END] (AOP) Logging : " + req.method + " " + req.url);
});

/**
 * for auth
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  ReqLogUtil.debug('[BEGIN] (AOP) Auth');
  const idToken = req.cookies[FirebaseAuthManager.ID_TOKEN_COOKIE_KEY];
  if (idToken != null) {
    ReqLogUtil.debug('request has the idToken in the cookie! : ' + idToken.substring(0, 50));
    const firebaseUserId = await firebaseAuthManager.verifyIdToken(idToken);
    if (firebaseUserId != null) {
      ReqLogUtil.debug('identified firebase auth uid : ' + firebaseUserId);
      TSLThreadLocal.currentContext.identifiedFirebaseUserId = firebaseUserId;

      const user = await userLogic.findUser(firebaseUserId);
      if (user != null) {
        ReqLogUtil.debug('The uid is already registered in the TSL!. The user name is ' + user.userName);
        if (user.loggedIn) {
          ReqLogUtil.debug('already logged in user!');
          TSLThreadLocal.currentContext.loggedInUser = user;
        } else {
          ReqLogUtil.debug('This user has not log in yet.');
        }
      } else {
        ReqLogUtil.debug('This firebase auth user has NOT created the TSL account yet.');
      }
    } else {
      ReqLogUtil.warn('invalid uid... maybe Firebase ID token has been expired.');
    }
  } else {
    ReqLogUtil.debug('request does NOT have the idToken in the cookie...');
  }

  ReqLogUtil.debug('threadLocal.identifiedFirebaseUserId : ' + TSLThreadLocal.currentContext.identifiedFirebaseUserId);
  ReqLogUtil.debug('threadLocal.loggedInUser : ' + TSLThreadLocal.currentContext.loggedInUser);

  await next();

  ReqLogUtil.debug('[  END] (AOP) Auth');
});
});