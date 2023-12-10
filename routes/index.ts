import express from 'express'
const app: express.Express = express()
const port = 3000

app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static('/public'));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

/* GET about page. */
app.get('/about', function(req, res, next) {
  res.render('pages/about', { title: 'About' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})