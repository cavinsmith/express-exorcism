var exorcism = require('../lib/express-exorcism');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var OneRouter = require('./routers/one');
var express = require('express');
var routers = {
  default: exorcism(express, {singletonRouter: true}),
  config1: exorcism(express, {singletonRouter: true, defaultResponseMethod: 'end'}),
  config2: exorcism(express, {singletonRouter: true, defaultResponseMethod: 'none'})
};
var app = express();

var TIMEOUT = 10000;

app.use('/one/default', OneRouter(routers.default));
app.use('/one/config1', OneRouter(routers.config1));
app.use('/one/config2', OneRouter(routers.config2));

describe('default config, one router', function () {
  this.timeout(TIMEOUT);

  after(function () {
    setTimeout(function () {
      process.exit(0);
    }, 100);
  });

  var request = chai.request.agent(app);

  it('sync route, using res.send(...)', function (done) {
    request
      .get('/one/default/sync/res.send')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });

  it('sync route, using next(...)', function (done) {
    request
      .get('/one/default/sync/res.send/error')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });

  it('async route, using return', function (done) {
    request
      .get('/one/default/async/return')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });


  it('async route, using throw', function (done) {
    request
      .get('/one/default/async/return/error')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });


  it('async route, using promise resolve', function (done) {
    request
      .get('/one/default/async/promise')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });

  it('async route, using promise reject', function (done) {
    request
      .get('/one/default/async/promise/error')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });

  // ////////////////////////////

  it('sync route, using res.send(...)', function (done) {
    request
      .get('/one/config1/sync/res.send')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });

  it('sync route, using next(...)', function (done) {
    request
      .get('/one/config1/sync/res.send/error')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });

  it('async route, using return', function (done) {
    request
      .get('/one/config1/async/return')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.text).to.be.string;
        expect(res.text).to.equal('');
        done();
      });
  });

  it('async route, using res.send', function (done) {
    request
      .get('/one/default/async/res.send')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });

  it('async route, using throw', function (done) {
    request
      .get('/one/config1/async/return/error')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });


  it('async route, using promise resolve', function (done) {
    request
      .get('/one/config1/async/promise')
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.text).to.be.string;
        expect(res.text).to.equal('');
        done();
      });
  });

  it('async route, using promise reject', function (done) {
    request
      .get('/one/config1/async/promise/error')
      .end(function (err, res) {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });

});
