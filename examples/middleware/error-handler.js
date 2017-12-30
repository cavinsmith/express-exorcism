module.exports = function (error, req, res, next) {
  next;
  res.send('Error: ' + error.message);
};
