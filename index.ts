import express from 'express'
import favicon from 'serve-favicon'
import './models/bizLogic'
import { BizLogic } from './models/bizLogic'
const app: express.Express = express()
const port = 3000

app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(favicon('./public/images/favicon.ico'));

app.get('/how-to-use', function(req, res, next) {
  res.render('pages/how-to-use', { menu1: true });
});
app.get('/new-posts', function(req, res, next) {
  const targetPosts = new BizLogic().findPosts();
  res.render('pages/new-posts', { targetPosts: targetPosts });
});
app.get('/post/:id', function(req, res, next) {
  const post = new BizLogic().findPost(req.params.id);
  res.render('pages/post-detail', { post: post });
});
app.get('/map', function(req, res, next) {
  const targetPosts = new BizLogic().findPosts();
  res.render('pages/map', { targetPosts: targetPosts });
});
app.get('/column', function(req, res, next) {
  res.render('pages/column', { menu2: true });
});
app.get('/my-page', function(req, res, next) {
  res.render('pages/my-page', { title: 'My Page' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})