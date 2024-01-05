/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import { routing } from "./controllers/routes";
import { firebaseAuthDao } from "./models/auth/firebaseAuthDao";
import { ReqLogUtil } from "./utils/reqLogUtil";
import { Request, Response, NextFunction } from "express";
import { TSLThreadLocal } from "./utils/tslThreadLocal";
import { userLogic } from "./models/bizlogic/userBizLogic";
import { FirebaseAdminManager } from "./models/firebase/firebaseAdminManager";

const app = express();
// const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));

// fix later!
// const favicon = require("serve-favicon");
// app.use(favicon("./src/kkrn_icon_kirakira_2.svg"));

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
      ReqLogUtil.warn('invalid uid...');
    }
  } else {
    ReqLogUtil.debug('request does NOT have the "idToken" in the cookie...');
  }

  ReqLogUtil.debug('threadLocal.identifiedFirebaseUserId : ' + TSLThreadLocal.currentContext.identifiedFirebaseUserId);
  ReqLogUtil.debug('threadLocal.loggedInUser : ' + TSLThreadLocal.currentContext.loggedInUser);

  await next();
});

FirebaseAdminManager.initialize();
//FirebaseManager.initialize();

routing(app);

// 出力
exports.app = functions.region("asia-northeast1").https.onRequest(app);
