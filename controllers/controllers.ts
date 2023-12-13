import express from 'express'
import { BizLogic } from '../models/bizLogic'

export const routing = ((app: express.Express): void => {
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
  app.get('/column', function (req, res, next) {
    res.render('pages/column', { menu2: true });
  });
  app.get('/my-page', function (req, res, next) {
    res.render('pages/my-page', { title: 'My Page' });
  });
});