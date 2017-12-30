var express = require('express');
require('./lib/express-exorcism')(express, {methodList: ['get']});
var errorHandler = require('./middleware/error-handler');
var router = express.Router();
var app = express();
var callbackRouter = require('./routes/callback');
var promiseRouter = require('./routes/promise');

router.use('/callback', callbackRouter);
router.use('/promise', promiseRouter);
app.use(router);
app.use(errorHandler);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
