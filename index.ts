import express from 'express'
const app: express.Express = express()
const port = 3000

app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

app.get('/how-to-use', function(req, res, next) {
  res.render('pages/how-to-use', { title: 'How to Use' });
});
app.get('/column', function(req, res, next) {
  res.render('pages/column', { title: 'Column' });
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