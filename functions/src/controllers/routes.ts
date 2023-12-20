import {Express} from "express";
import {BizLogic} from "../models/bizLogic";
import {IPost, PostCategory} from "../models/serverTslDef";
import {TslLogUtil} from "../utils/tslLogUtil";

const bizLogic = new BizLogic();

export const routing = ((app: Express): void => {
  app.get("/login", function(req, res, next) {
    res.render("pages/login", {user: bizLogic.getLoggedInUser()});
  });
  app.post("/login", function(req, res, next) {
    bizLogic.setLoggedInUser({
      id: "123",
      userName: "Yasu",
      iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
      selfIntroduction: "こんにちは〜",
      twitterProfileLink: "https://www.yahoo.co.jp",
      instagramProfileLink: "https://www.yahoo.co.jp",
    });
    res.render("pages/my-page", {user: bizLogic.getLoggedInUser(), toast: true});
  });
  app.get("/my-page", function(req, res, next) {
    res.render("pages/my-page", {user: bizLogic.getLoggedInUser()});
  });
  app.post("/logout", function(req, res, next) {
    bizLogic.logout();
    res.render("pages/login", {user: bizLogic.getLoggedInUser(), toast: true});
  });
  app.get("/how-to-use", function(req, res, next) {
    res.render("pages/how-to-use", {user: bizLogic.getLoggedInUser()});
  });
  app.get("/new-posts", function(req, res, next) {
    const targetPosts = bizLogic.findPosts();
    res.render("pages/new-posts", {user: bizLogic.getLoggedInUser(), targetPosts: targetPosts});
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
      id: "10",
      user: {
        id: "1",
        userName: "abc",
        iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
      },
      imageUrl: "",
      lat: Number(req.body.markerLat),
      lng: Number(req.body.markerLng),
      description: req.body.comment,
      postCategory: postCategory,
      insertDate: new Date(),
      postComments: [],
    };
    bizLogic.createPost(newPost);
    const post = bizLogic.findPost(newPost.id);
    res.render("pages/post-detail", {user: bizLogic.getLoggedInUser(), post: post, showBack: false, toast: true});
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

  app.all("*", (req, res) => {
    TslLogUtil.warn(req.url);
    res.render("pages/404", {user: bizLogic.getLoggedInUser()});
  });
});
