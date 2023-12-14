import express from 'express'
import favicon from 'serve-favicon'
import { routing } from './controllers/controllers'

const app: express.Express = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(favicon('./public/images/favicon.ico'));

routing(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})