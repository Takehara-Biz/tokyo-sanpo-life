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

import { addMiddleware } from "./controllers/middleware";
import { routing } from "./controllers/routes";
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

addMiddleware(app);

FirebaseAdminManager.initialize();
//FirebaseManager.initialize();

routing(app);

// 出力
exports.app = functions.region("asia-northeast1").https.onRequest(app);
