module.exports = (router) => {

  router.asyncGet('/group/sync/res.send', (req, res) => {
    res.send({result: 'OK'});
  });

  router.get('/sync/res.send', (req, res) => {
    res.send({result: 'OK'});
  });

  router.get('/sync/res.send/error', (req, res, next) => {
    res.status(500);
    next('ERROR');
  });

  router.get('/async/return', async () => {
    return {result: 'OK'};
  });

  router.get('/async/res.send', async (req, res) => {
    res.send({result: 'OK'});
  });


  router.get('/async/return/error', async (req, res) => {
    res.status(500);
    throw 'ERROR';
  });

  router.get('/async/promise', async () => {
    return new Promise((resolve) => {
      resolve({result: 'OK'});
    });
  });

  router.get('/async/promise/error', async () => {
    return new Promise((resolve, reject) => {
      reject('ERROR');
    });
  });

  return router;
};
