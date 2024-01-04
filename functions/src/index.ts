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
// Expressの読み込み
const express = require("express");
const cookieParser = require('cookie-parser');

import { routing } from "./controllers/routes";
import { firebaseAuthDao } from "./models/auth/firebaseAuthDao";
import { TslLogUtil } from "./utils/tslLogUtil";
import { Request, Response, NextFunction } from "express";
import { TSLThreadLocal } from "./utils/tslThreadLocal";
import { userLogic } from "./models/bizlogic/userLogic";

const app = express();
// const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));

// fix later!
// const favicon = require("serve-favicon");
// app.use(favicon("./src/kkrn_icon_kirakira_2.svg"));

/**
 * for logging
 */
app.use(function (req: Request, res: Response, next: NextFunction) {
  TslLogUtil.info("[BEGIN] " + req.method + " " + req.url + ",\nreq.params=" + JSON.stringify(req.params) + ",\nreq.body=" + JSON.stringify(req.body));
  TslLogUtil.debug("req.cookies=" + JSON.stringify(req.cookies));
  next();
  TslLogUtil.info("[  END] " + req.url);
  TslLogUtil.debug("res.cookie=" + res.get('Set-Cookie'));
});

/**
 * for auth
 */
app.use(async function (req: Request, res: Response, next: NextFunction) {
  const idToken = req.cookies['idToken'];
  const threadLocal = new TSLThreadLocal();
  if (idToken != null) {
    const uid = await firebaseAuthDao.verifyIdToken(idToken);
    if (uid != null) {
      threadLocal.identifiedFirebaseUserId = uid;
      if (userLogic.alreadyLoggedIn(uid)) {
        threadLocal.loggedInUser = userLogic.getLoggedInUser(uid);
      }
    }
  }

  TslLogUtil.debug('threadLocal.identifiedFirebaseUserId : ' + threadLocal.identifiedFirebaseUserId);
  TslLogUtil.debug('threadLocal.loggedInUser : ' + threadLocal.loggedInUser);

  TSLThreadLocal.storage.run(
    threadLocal,
    async () => {
      next();
    },
  );
});


routing(app);

// 出力
exports.app = functions.region("asia-northeast1").https.onRequest(app);
