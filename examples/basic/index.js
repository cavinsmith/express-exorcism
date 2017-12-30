var express = require('express');
require('./lib/express-exorcism')(express);
var router = express.Router();
var app = express();

router.get('/', async (req, res) => {
  return 'Promise OK'
})

router.get('/error', async (req, res) => {
  throw new Error('Promise OK (error variant)')
})

app.use(router);
app.use(errorHandler);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
