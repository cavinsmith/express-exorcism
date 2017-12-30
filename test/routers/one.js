module.exports = function (router) {

  router.get('/sync/res.send', function (req, res) {
    res.send({result: 'OK'});
  });

  router.get('/sync/res.send/error', function (req, res, next) {
    res.status(500);
    next('ERROR');
  });

  router.get('/async/return', async () => {
    return {result: 'OK'};
  });

  router.get('/async/res.send', async function (req, res) {
    res.send({result: 'OK'});
    return;
  });


  router.get('/async/return/error', async function (req, res) {
    res.status(500);
    throw 'ERROR';
  });

  router.get('/async/promise', async function () {
    return new Promise( function (resolve) {
      resolve({result: 'OK'});
    });
  });

  router.get('/async/promise/error', async function () {
    return new Promise( function (resolve, reject) {
      reject('ERROR');
    });
  });

  return router;
}
