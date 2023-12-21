import {Express} from "express";
import {BizLogic} from "../models/bizLogic";
import {IPost, PostCategory} from "../models/serverTslDef";
import {TslLogUtil} from "../utils/tslLogUtil";

const bizLogic = new BizLogic();

export const routing = ((app: Express): void => {
  app.get("/login", function(req, res, next) {
    const toast = req.query.toast != undefined;
    res.render("pages/login", {user: bizLogic.getLoggedInUser(), toast: toast});
  });
  app.post("/login", function(req, res, next) {
    const user = bizLogic.findUser("1");
    if ( user !== null ) {
      bizLogic.setLoggedInUser(user);
      res.redirect("/my-page?toast");
    } else {
      // not found
      res.render("pages/404");
    }
  });
  app.get("/my-page", function(req, res, next) {
    const toast = req.query.toast != undefined;
    res.render("pages/my-page", {user: bizLogic.getLoggedInUser(), toast: toast});
  });
  app.post("/logout", function(req, res, next) {
    bizLogic.logout();
    res.redirect("/login?toast");
  });
  app.get("/how-to-use", function(req, res, next) {
    res.render("pages/how-to-use", {user: bizLogic.getLoggedInUser()});
  });
  app.get("/new-posts", function(req, res, next) {
    const targetPosts = bizLogic.findPosts();
    const deletedToast = req.query.deletedToast != undefined;
    res.render("pages/new-posts", {user: bizLogic.getLoggedInUser(), targetPosts: targetPosts, deletedToast: deletedToast});
  });
  app.get("/post/:id", function(req, res, next) {
    const post = bizLogic.findPost(req.params.id);
    if ( post !== null ) {
      res.render("pages/post-detail", {user: bizLogic.getLoggedInUser(), post: post, showBack: true});
    } else {
      // not found
      res.render("pages/404");
    }
  });

  app.delete("/post/:id", function(req, res, next) {
    // needs authorization
    try {
      bizLogic.deletePost(req.params.id!.toString());
    } catch (error) {
      TslLogUtil.warn('failed to delete the post ' + req.query.id);
      TslLogUtil.warn(error);
      res.render("pages/500");
      return;
    }
    res.redirect('/new-posts?deletedToast=true');
  });

  app.post("/post", function(req, res, next) {
    console.log("req : " + req);
    console.log("req.params : " + req.params);
    console.log("req.body : " + JSON.stringify(req.body));
    console.log("req.body.comment : " + req.body.comment);
    console.log("req.body.postCategory : " + req.body.postCategory);
    console.log("req.body.uploadPhoto : " + req.body.uploadPhoto);
    console.log("req.body.markerLat : " + req.body.markerLat);
    console.log("req.body.markerLng : " + req.body.markerLng);

    const postCategory = PostCategory.findCategory(Number(req.body.postCategory));
    console.log("aa" + postCategory);
    console.log("aa" + postCategory.getLabel());
    const newPost: IPost = {
      id: "this will be updated in dao class",
      user: bizLogic.getLoggedInUser()!,
      imageUrl: "/images/post-sample.jpeg",
      lat: Number(req.body.markerLat),
      lng: Number(req.body.markerLng),
      description: req.body.comment,
      postCategory: postCategory,
      insertDate: new Date(),
      postComments: [],
    };
    bizLogic.createPost(newPost);
    const post = bizLogic.findPost(newPost.id);
    res.redirect("/post/" + post!.id)
  });
  app.get("/map", function(req, res, next) {
    const targetPosts = bizLogic.findPosts();
    res.render("pages/map", {user: bizLogic.getLoggedInUser(), targetPosts: targetPosts});
  });
  app.get("/add-record", function(req, res, next) {
    res.render("pages/add-record", {user: bizLogic.getLoggedInUser()});
  });
  app.get("/add-post", function(req, res, next) {
    res.render("pages/add-post", {user: bizLogic.getLoggedInUser(), categories: PostCategory.Categories});
  });

  // 以下、othersページおよびその配下

  app.get("/others", function(req, res, next) {
    res.render("pages/others", {user: bizLogic.getLoggedInUser()});
  });
  app.get("/others/about", function(req, res, next) {
    res.render("pages/others/about", {user: bizLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/developer", function(req, res, next) {
    res.render("pages/others/developer", {user: bizLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/tech", function(req, res, next) {
    res.render("pages/others/tech", {user: bizLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/terms-of-service", function(req, res, next) {
    res.render("pages/others/terms-of-service", {user: bizLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/privacy-policy", function(req, res, next) {
    res.render("pages/others/privacy-policy", {user: bizLogic.getLoggedInUser(), showBack: true});
  });
  app.get("/others/cookie-policy", function(req, res, next) {
    res.render("pages/others/cookie-policy", {user: bizLogic.getLoggedInUser(), showBack: true});
  });

  // 以下、エラーページ

  app.get("/500", function(req, res, next) {
    res.render("pages/500", {user: bizLogic.getLoggedInUser()});
  });

  app.all("*", (req, res) => {
    TslLogUtil.warn(req.url);
    res.render("pages/404", {user: bizLogic.getLoggedInUser()});
  });
});
