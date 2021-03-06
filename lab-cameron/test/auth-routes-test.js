'use strict';

const server = require('../server.js');
const User = require('../models/user');
const chai = require('chai');
const http = require('chai-http');
const expect = chai.expect;

chai.use(http);

describe('Server module', function() {
  describe('#POST', function() {
    after(done => {
      User.findOne({username: 'cameron'})
      .then(user => {
        User.findByIdAndRemove(user._id)
        .then(() => done());
      });
    });

    describe('requests made to /api/signup', function() {
      it('should respond with status 200 on a proper request', done => {
        chai.request(server)
        .post('/api/signup')
        .send({username: 'cameron', email: 'cameron@bacon.yum', password: 'bacon'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
      });

      it('should respond with status 400 on a bad request', done => {
        chai.request(server)
        .post('/api/signup')
        .send()
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
      });
    });
  });

  describe('#GET', function() {
    before(done => {
      chai.request(server)
      .post('/api/signup')
      .send({username: 'cameron', email: 'cameron@bacon.yum', password: 'bacon'})
      .end(() => done());
    });
    after(done => {
      User.findOne({username: 'cameron'})
      .then(user => {
        User.findByIdAndRemove(user._id)
        .then(() => done());
      });
    });

    describe('requests made to /api/signin', function() {
      it('should respond with status 200 on a proper request', done => {
        chai.request(server)
        .get('/api/signin')
        .auth('cameron', 'bacon')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
      });

      it('should respond with status 401 on a bad request', done => {
        chai.request(server)
        .get('/api/signin')
        .auth('cameron', '1234')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
      });
    });
  });
});
