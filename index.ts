import express from 'express'
import favicon from 'serve-favicon'
import { routing } from './src/controllers/routes'
import { TslLogUtil } from './src/utils/tslLogUtil'

const app: express.Express = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(favicon('./public/images/favicon.ico'));
app.use(function(req, res, next) {
  TslLogUtil.debug('[BEGIN] ' + req.url + ", req.params=" + JSON.stringify(req.params) + ", req.body=" + JSON.stringify(req.body));
  next();
  TslLogUtil.debug('[  END] ' + req.url);
});

routing(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})