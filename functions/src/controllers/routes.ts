import { Express } from "express";
import { postLogic } from "../models/bizlogic/postLogic";
import { userLogic } from "../models/bizlogic/userLogic";
import { addUsersRouting } from "./users";
import { addOthersRouting } from "./others";
import { addErrorsRouting } from "./errors";
import { addPostsRouting } from "./posts";
import { addPostsEmojiEvalulationsRouting } from "./posts-emoji-evaluations";

export const routing = ((app: Express): void => {

  app.get("/how-to-use", function (req, res, next) {
    res.render("pages/how-to-use", { user: userLogic.getLoggedInUser() });
  });

  app.get("/map", function (req, res, next) {
    const targetPosts = postLogic.findPosts();
    res.render("pages/map", { user: userLogic.getLoggedInUser(), targetPosts: targetPosts });
  });

  app.get("/add-record", function (req, res, next) {
    res.render("pages/add-record", { user: userLogic.getLoggedInUser() });
  });

  addUsersRouting(app);
  addPostsRouting(app);
  addPostsEmojiEvalulationsRouting(app);
  addOthersRouting(app);

  // this must be called at last definitely!
  addErrorsRouting(app);
});