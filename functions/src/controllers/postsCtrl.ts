import { Express } from "express";
import { postLogic } from "../models/bizlogic/postBizLogic";
import { ReqLogUtil } from "../utils/reqLogUtil";
import { EJS_404_PAGE_PATH, EJS_500_PAGE_PATH } from "./errorsCtrl";
import { CtrlUtil } from "./ctrlUtil";
import { TSLThreadLocal } from "../utils/tslThreadLocal";
import { PostDto } from "../models/dto/postDto";
import { PostCategory } from "../models/postCategory";

/**
 * implements URL related to "posts" pages.
 * @param app 
 */
export const addPostsRouting = ((app: Express): void => {
  const EJS_PREFIX = "pages/posts/"
  const URL_PREFIX = "/posts"

  app.get(URL_PREFIX + "/new-list", async function (req, res, next) {
    const targetPosts = await postLogic.listOrderbyInsertedAtDesc();
    const deletedToast = req.query.deletedToast != undefined;
    CtrlUtil.render(res, EJS_PREFIX + "new-list", {
      targetPosts: targetPosts, deletedToast: deletedToast
    });
  });
  app.get(URL_PREFIX + "/my-list", async function (req, res, next) {
    let myPosts: PostDto[] = [];
    if (TSLThreadLocal.currentContext?.loggedInUser != undefined) {
      const firebaseUserId = TSLThreadLocal.currentContext!.loggedInUser!.firebaseUserId!
      const savedData = await postLogic.listByUserId(firebaseUserId);
      myPosts.push(...savedData);
    }
    CtrlUtil.render(res, EJS_PREFIX + "my-list", { myPosts: myPosts });
  });
  app.get(URL_PREFIX + "/create", function (req, res, next) {
    CtrlUtil.render(res, EJS_PREFIX + "create", { categories: PostCategory.Categories });
  });
  app.get(URL_PREFIX + "/:id", async function (req, res, next) {
    const post = await postLogic.find(req.params.id);

    // when comes from list screen.
    let showBack = true;
    // when comes after created a post.
    if (req.params.showBack === "false") {
      showBack = false;
    }

    if (post !== null) {
      CtrlUtil.render(res, EJS_PREFIX + "read", { post: post, showBack: showBack });
    } else {
      // not found
      CtrlUtil.render(res, EJS_404_PAGE_PATH);
    }
  });

  app.delete(URL_PREFIX + "/:id", function (req, res, next) {
    // needs authorization
    try {
      postLogic.delete(req.params.id!.toString());
    } catch (error) {
      ReqLogUtil.warn('failed to delete the post ' + req.query.id);
      ReqLogUtil.warn(error);
      res.render(EJS_500_PAGE_PATH);
      return;
    }
    res.redirect(EJS_PREFIX + '/new-posts?deletedToast=true');
  });

  app.post(URL_PREFIX, async function (req, res, next) {

    const postCategory = PostCategory.findCategory(Number(req.body.postCategory));

    const now = new Date();
    const newPost: PostDto = {
      user: TSLThreadLocal.currentContext!.loggedInUser!,
      imageUrl: "/images/post-sample.jpeg",
      lat: Number(req.body.markerLat),
      lng: Number(req.body.markerLng),
      description: req.body.comment,
      postCategory: postCategory,
      postComments: [],
      emojiEvaluations: [],
      postedFirebaseUserId: TSLThreadLocal.currentContext!.identifiedFirebaseUserId!,
      insertedAt: now,
      updatedAt: now,
    };
    const postId = await postLogic.create(newPost);
    res.redirect("/posts/" + postId + "?showBack=false")
  });

  app.get(URL_PREFIX + "/update/:id", function (req, res, next) {
    // needs authorization
    const post = postLogic.find(req.params.id);
    if (post !== null) {
      CtrlUtil.render(res, EJS_PREFIX + "update", { post: post, showBack: true });
    } else {
      // not found
      CtrlUtil.render(res, EJS_404_PAGE_PATH);
    }
  });
  
  /**
   * expects to be called with Ajax.
   */
  app.get("/map/post/:id", function (req, res, next) {
    const post = postLogic.find(req.params.id);
    if (post !== null) {
      CtrlUtil.render(res, "partials/exclusive/map-post-read", {post: post});
    } else {
      // not found
      CtrlUtil.render(res, EJS_404_PAGE_PATH);
    }
  });
});