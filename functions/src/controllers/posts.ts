import { Express } from "express";
import { postLogic } from "../models/bizlogic/postLogic";
import { userLogic } from "../models/bizlogic/userLogic";
import { IPost, PostCategory } from "../models/serverTslDef";
import { TslLogUtil } from "../utils/tslLogUtil";
import { EJS_404_PAGE_PATH, EJS_500_PAGE_PATH } from "./errors";

/**
 * implements URL related to "posts" pages.
 * @param app 
 */
export const addPostsRouting = ((app: Express): void => {
  const EJS_PREFIX = "pages/posts/"
  const URL_PREFIX = "/posts"

  app.get(URL_PREFIX + "/new-list", function (req, res, next) {
    const targetPosts = postLogic.findPosts();
    const deletedToast = req.query.deletedToast != undefined;
    res.render(EJS_PREFIX + "new-list", { user: userLogic.getLoggedInUser(), targetPosts: targetPosts, deletedToast: deletedToast });
  });
  app.get(URL_PREFIX + "/my-list", function (req, res, next) {
    let myPosts: IPost[] = [];
    if (userLogic.alreadyLoggedIn()) {
      myPosts.push(...postLogic.findPostsByUserId(userLogic.getLoggedInUser()!.id));
    }
    res.render(EJS_PREFIX + "my-list", { user: userLogic.getLoggedInUser(), myPosts: myPosts });
  });
  app.get(URL_PREFIX + "/create", function (req, res, next) {
    res.render(EJS_PREFIX + "create", { user: userLogic.getLoggedInUser(), categories: PostCategory.Categories });
  });
  app.get(URL_PREFIX + "/:id", function (req, res, next) {
    const post = postLogic.findPost(req.params.id);
    if (post !== null) {
      res.render(EJS_PREFIX + "read", { user: userLogic.getLoggedInUser(), post: post, showBack: true });
    } else {
      // not found
      res.render(EJS_404_PAGE_PATH, { user: userLogic.getLoggedInUser() });
    }
  });

  app.delete(URL_PREFIX + "/:id", function (req, res, next) {
    // needs authorization
    try {
      postLogic.deletePost(req.params.id!.toString());
    } catch (error) {
      TslLogUtil.warn('failed to delete the post ' + req.query.id);
      TslLogUtil.warn(error);
      res.render(EJS_500_PAGE_PATH);
      return;
    }
    res.redirect(EJS_PREFIX + '/new-posts?deletedToast=true');
  });

  app.post(URL_PREFIX, function (req, res, next) {
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
      emojiEvaluations: [],
    };
    postLogic.createPost(newPost);
    const post = postLogic.findPost(newPost.id);
    res.redirect("/posts/" + post!.id)
  });

  app.get(URL_PREFIX + "/update/:id", function (req, res, next) {
    // needs authorization
    const post = postLogic.findPost(req.params.id);
    if (post !== null) {
      res.render(EJS_PREFIX + "update", { user: userLogic.getLoggedInUser(), post: post, showBack: true });
    } else {
      // not found
      res.render(EJS_404_PAGE_PATH, { user: userLogic.getLoggedInUser() });
    }
  });
  
  /**
   * expects to be called with Ajax.
   */
  app.get("/map/post/:id", function (req, res, next) {
    const post = postLogic.findPost(req.params.id);
    if (post !== null) {
      res.render("partials/exclusive/map-post-read", { user: userLogic.getLoggedInUser(), post: post });
    } else {
      // not found
      res.render(EJS_404_PAGE_PATH, { user: userLogic.getLoggedInUser() });
    }
  });
});