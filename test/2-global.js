/* eslint-disable no-unused-expressions */

const exorcism = require('../src/express-exorcism');
const chai = require('chai');
chai.use(require('chai-http'));

const expect = chai.expect;
const OneRouter = require('./routers/one');
const express = require('express');

exorcism(express);

const app = express();

const TIMEOUT = 10000;

app.use('/one/default', OneRouter(express.Router()));

describe('default config, one router', function () {
  this.timeout(TIMEOUT);

  after(() => {
    setTimeout(() => {
      process.exit(0);
    }, 100);
  });

  const request = chai.request.agent(app);

  it('sync route, using res.send(...)', (done) => {
    request
      .get('/one/default/sync/res.send')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });

  it('sync route, using next(...)', (done) => {
    request
      .get('/one/default/sync/res.send/error')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });

  it('async route, using return', (done) => {
    request
      .get('/one/default/async/return')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });


  it('async route, using throw', (done) => {
    request
      .get('/one/default/async/return/error')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });


  it('async route, using promise resolve', (done) => {
    request
      .get('/one/default/async/promise')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.result).to.equal('OK');
        done();
      });
  });

  it('async route, using promise reject', (done) => {
    request
      .get('/one/default/async/promise/error')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.text).to.be.string;
        expect(res.text).to.contain('<pre>ERROR</pre>');
        done();
      });
  });

});
