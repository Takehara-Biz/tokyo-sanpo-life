import express from 'express'
import { BizLogic } from '../models/bizLogic'
import { PostCategory } from '../models/serverTslDef';

export const routing = ((app: express.Express): void => {
  app.get('/login', function (req, res, next) {
    res.render('pages/login', { menu1: true });
  });
  app.get('/how-to-use', function (req, res, next) {
    res.render('pages/how-to-use', { menu1: true });
  });
  app.get('/new-posts', function (req, res, next) {
    const targetPosts = new BizLogic().findPosts();
    res.render('pages/new-posts', { targetPosts: targetPosts });
  });
  app.get('/post/:id', function (req, res, next) {
    const post = new BizLogic().findPost(req.params.id);
    res.render('pages/post-detail', { post: post, showBack: true });
  });
  app.get('/map', function (req, res, next) {
    const targetPosts = new BizLogic().findPosts();
    res.render('pages/map', { targetPosts: targetPosts });
  });
  app.get('/add-post', function (req, res, next) {
    res.render('pages/add-post', { categories: PostCategory.Categories });
  });
  app.get('/others', function (req, res, next) {
    res.render('pages/others', { title: 'My Page' });
  });
});