import {Express} from "express";
import {PostLogic} from "../models/bizlogic/postLogic";
import {UserLogic} from "../models/bizlogic/userLogic";
import {IPost, PostCategory} from "../models/serverTslDef";
import {TslLogUtil} from "../utils/tslLogUtil";
import { addUserRouting } from "./user";
import { addOthersRouting } from "./others";
import { addErrorsRouting } from "./errors";

const postLogic = new PostLogic();
const userLogic = new UserLogic();

export const routing = ((app: Express): void => {

  addUserRouting(app);

  // main screens

  app.get("/how-to-use", function(req, res, next) {
    res.render("pages/how-to-use", {user: userLogic.getLoggedInUser()});
  });
  app.get("/new-posts", function(req, res, next) {
    const targetPosts = postLogic.findPosts();
    const deletedToast = req.query.deletedToast != undefined;
    res.render("pages/new-posts", {user: userLogic.getLoggedInUser(), targetPosts: targetPosts, deletedToast: deletedToast});
  });
  app.get("/my-posts", function(req, res, next) {
    let myPosts: IPost[] = [];
    if(userLogic.alreadyLoggedIn()){
      myPosts.push(...postLogic.findPostsByUserId(userLogic.getLoggedInUser()!.id));
    }
    res.render("pages/my-posts", {user: userLogic.getLoggedInUser(), myPosts: myPosts});
  });
  app.get("/post/:id", function(req, res, next) {
    const post = postLogic.findPost(req.params.id);
    if ( post !== null ) {
      res.render("pages/post-detail", {user: userLogic.getLoggedInUser(), post: post, showBack: true});
    } else {
      // not found
      res.render("pages/404");
    }
  });

  app.delete("/post/:id", function(req, res, next) {
    // needs authorization
    try {
      postLogic.deletePost(req.params.id!.toString());
    } catch (error) {
      TslLogUtil.warn('failed to delete the post ' + req.query.id);
      TslLogUtil.warn(error);
      res.render("pages/500");
      return;
    }
    res.redirect('/new-posts?deletedToast=true');
  });

  app.post("/post", function(req, res, next) {
    TslLogUtil.debug("req : " + req);
    TslLogUtil.debug("req.params : " + req.params);
    TslLogUtil.debug("req.body : " + JSON.stringify(req.body));
    TslLogUtil.debug("req.body.comment : " + req.body.comment);
    TslLogUtil.debug("req.body.postCategory : " + req.body.postCategory);
    TslLogUtil.debug("req.body.uploadPhoto : " + req.body.uploadPhoto);
    TslLogUtil.debug("req.body.markerLat : " + req.body.markerLat);
    TslLogUtil.debug("req.body.markerLng : " + req.body.markerLng);

    const postCategory = PostCategory.findCategory(Number(req.body.postCategory));
    TslLogUtil.debug("aa" + postCategory);
    TslLogUtil.debug("aa" + postCategory.getLabel());
    const newPost: IPost = {
      id: "this will be updated in dao class",
      user: userLogic.getLoggedInUser()!,
      imageUrl: "/images/post-sample.jpeg",
      lat: Number(req.body.markerLat),
      lng: Number(req.body.markerLng),
      description: req.body.comment,
      postCategory: postCategory,
      insertDate: new Date(),
      postComments: [],
    };
    postLogic.createPost(newPost);
    const post = postLogic.findPost(newPost.id);
    res.redirect("/post/" + post!.id)
  });
  app.get("/edit-post/:id", function(req, res, next) {
    // needs authorization
    const post = postLogic.findPost(req.params.id);
    if ( post !== null ) {
      res.render("pages/edit-post", {user: userLogic.getLoggedInUser(), post: post, showBack: true});
    } else {
      // not found
      res.render("pages/404", {user: userLogic.getLoggedInUser()});
    }
  });
  app.get("/map", function(req, res, next) {
    const targetPosts = postLogic.findPosts();
    res.render("pages/map", {user: userLogic.getLoggedInUser(), targetPosts: targetPosts});
  });

  /**
   * expects to be called with Ajax.
   */
  app.get("/map/post/:id", function(req, res, next) {
    const post = postLogic.findPost(req.params.id);
    if ( post !== null ) {
      res.render("partials/map-post-detail", {user: userLogic.getLoggedInUser(), post: post});
    } else {
      // not found
      res.render("pages/404", {user: userLogic.getLoggedInUser()});
    }
  });
  app.get("/add-record", function(req, res, next) {
    res.render("pages/add-record", {user: userLogic.getLoggedInUser()});
  });
  app.get("/add-post", function(req, res, next) {
    res.render("pages/add-post", {user: userLogic.getLoggedInUser(), categories: PostCategory.Categories});
  });

  addOthersRouting(app);

  // this must be called at last definitely!
  addErrorsRouting(app);
});