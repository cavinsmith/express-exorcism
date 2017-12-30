var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('Callback result OK');
});

router.get('/error', function (req, res, next) {
  next(new Error('Callback reult OK (error variant)'));
});

module.exports = router;
