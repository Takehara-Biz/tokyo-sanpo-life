import express from 'express'
import favicon from 'serve-favicon'
const app: express.Express = express()
const port = 3000

app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(favicon('./public/images/favicon.ico'));

app.get('/how-to-use', function(req, res, next) {
  res.render('pages/how-to-use', { menu1: true });
});
app.get('/column', function(req, res, next) {
  res.render('pages/column', { menu2: true });
});
app.get('/map', function(req, res, next) {
  res.render('pages/map', { title: 'Map' });
});
app.get('/community', function(req, res, next) {
  res.render('pages/community', { title: 'Community' });
});
app.get('/my-page', function(req, res, next) {
  res.render('pages/my-page', { title: 'My Page' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})