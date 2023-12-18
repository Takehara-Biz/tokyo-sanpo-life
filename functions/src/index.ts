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

import {routing} from "./controllers/routes";
import {TslLogUtil} from "./utils/tslLogUtil";
import {Request, Response, NextFunction} from "express";

const app = express();
// const port = 3000

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("public"));

// fix later!
//const favicon = require("serve-favicon");
//app.use(favicon("../public/images/favicon.ico"));

app.use(function(req: Request, res: Response, next: NextFunction) {
  TslLogUtil.debug("[BEGIN] " + req.url + ", req.params=" + JSON.stringify(req.params) + ", req.body=" + JSON.stringify(req.body));
  next();
  TslLogUtil.debug("[  END] " + req.url);
});

routing(app);

// app.get('/hello', (req: any, res: any) => {
//   // レスポンスの設定
//   res.send('Hello Express!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// 出力
exports.app = functions.region("asia-northeast1").https.onRequest(app);
