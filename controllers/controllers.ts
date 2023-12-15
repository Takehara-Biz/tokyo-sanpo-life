import express from 'express'
import { BizLogic } from '../models/bizLogic'
import { IPost, PostCategory } from '../models/serverTslDef';

const bizLogic = new BizLogic();

export const routing = ((app: express.Express): void => {
  app.get('/login', function (req, res, next) {
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
    res.render('pages/post-detail', { post: post, showBack: true });
  });
  app.post('/post', function (req, res, next) {
    console.log('req : ' + req);
    console.log('req.params : ' + req.params);
    console.log('req.body : ' + JSON.stringify(req.body));
    let postCategory = PostCategory.findCategory(req.body.postCategory);
    let newPost: IPost = {
      id: "10",
      description: req.body.comment,
      postCategory: postCategory,
      user: {
        id: "1",
        userName: "abc",
        iconUrl: "https://3.bp.blogspot.com/-SGNTyEM-dcA/Vlmd3H73mFI/AAAAAAAA1G8/yPgxI8YdJWE/s150/christmas_mark09_bear.png",
      },
      title: '',
      imageUrl: '',
      lat: 0,
      lon: 0,
      insertDate: new Date(),
      postComments: []
    }
    console.log('req.body : ' + req.body.comment);
    console.log('req.body : ' + req.body.postCategory);
    console.log('req.body : ' + req.body.uploadPhoto);
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
});