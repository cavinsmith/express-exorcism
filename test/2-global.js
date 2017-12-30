var exorcism = require('../lib/express-exorcism');
var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var OneRouter = require('./routers/one');
var express = require('express');
exorcism(express);

var app = express();

var TIMEOUT = 10000;

app.use('/one/default', OneRouter(express.Router()));

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

});
