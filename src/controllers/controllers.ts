import express from 'express'
import { BizLogic } from '../models/bizLogic';
import { IPost, PostCategory } from '../models/serverTslDef';
import { TslLogUtil } from '../utils/tslLogUtil';

const bizLogic = new BizLogic();

export const routing = ((app: express.Express): void => {
  app.get('/login', function (req, res, next) {
    res.render('pages/login', { menu1: true });
  });
  app.post('/login', function (req, res, next) {
    bizLogic.setLoggedInUserId("1");
    res.render('pages/my-page', { menu1: true });
  });
  app.post('/logout', function (req, res, next) {
    bizLogic.logout();
    res.render('pages/login', { menu1: true });
  });
  app.get('/how-to-use', function (req, res, next) {
    res.render('pages/how-to-use');
  });
  app.get('/new-posts', function (req, res, next) {
    const targetPosts = bizLogic.findPosts();
    res.render('pages/new-posts', { targetPosts: targetPosts });
  });
  app.get('/post/:id', function (req, res, next) {
    const post = bizLogic.findPost(req.params.id);
    if( post !== null ){
      res.render('pages/post-detail', { post: post, showBack: true });
    } else {
      // not found
      res.render('pages/404');
    }
  });
  app.post('/post', function (req, res, next) {
    console.log('req : ' + req);
    console.log('req.params : ' + req.params);
    console.log('req.body : ' + JSON.stringify(req.body));
    console.log('req.body.comment : ' + req.body.comment);
    console.log('req.body.postCategory : ' + req.body.postCategory);
    console.log('req.body.uploadPhoto : ' + req.body.uploadPhoto);
    console.log('req.body.markerLat : ' + req.body.markerLat);
    console.log('req.body.markerLng : ' + req.body.markerLng);

    let postCategory = PostCategory.findCategory(Number(req.body.postCategory));
    console.log('aa' + postCategory);
    console.log('aa' + postCategory.getLabel());
    let newPost: IPost = {
      id: "10",
      user: {
        id: "1",
        userName: "abc",
        iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
      },
      imageUrl: '',
      lat: Number(req.body.markerLat),
      lng: Number(req.body.markerLng),
      description: req.body.comment,
      postCategory: postCategory,
      insertDate: new Date(),
      postComments: []
    }
    bizLogic.createPost(newPost);
    const post = bizLogic.findPost(newPost.id);
    res.render('pages/post-detail', { post: post, showBack: false });
  });
  app.get('/map', function (req, res, next) {
    const targetPosts = bizLogic.findPosts();
    res.render('pages/map', { targetPosts: targetPosts });
  });
  app.get('/add-post', function (req, res, next) {
    res.render('pages/add-post', { categories: PostCategory.Categories });
  });
  app.get('/others', function (req, res, next) {
    res.render('pages/others', { title: 'My Page' });
  });
  app.all("*", (req, res) => {
    TslLogUtil.warn(req.url);
    res.render('pages/404');
  });
});