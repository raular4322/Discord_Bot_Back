const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const config = require('../config');
const mongoose = require('mongoose');
const {expect} = require(`chai`);
const chai = require('chai');
const chaiHttp = require(`chai-http`);

const serverURL = 'http://localhost:3000';

chai.use(chaiHttp);

let token = '';

const testAdmin = new Admin({
  nickname: 'testAdmin2',
  tag: '0005',
  tagname: 'test#0000',
  password: '0000',
});

const testUser = new User({
  nickname: 'test',
  tag: '0000',
  tagname: 'test#0000',
  password: '0000',
});

before((done) => {
  db = mongoose.connect('mongodb://localhost:27017/discord_bot', {useNewUrlParser: true}).then(() => {
    testUser.save().then((saved) => {
      testAdmin.save().then((saved) => {
        done();
      });
    });
  });
});


describe('Check login function of adminController.js', () => {
  it('Should return 200 if all goes well', (done) => {
    const body = {
      nickname: 'testAdmin2',
      tag: '0005',
      tagname: 'test#0000',
      password: '0000',
    };
    chai.request(serverURL)
        .post('/admin/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          token = res.body.token;
          done();
        });
  });
});

describe('Check signup function of UserController.js', () => {
  it('Should return 400 if no params are send', (done) => {
    const body = {};
    chai.request(serverURL)
        .post('/user/signup')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 400 if User already exist', (done) => {
    const body = {
      nickname: 'test',
      tag: '0000',
      tagname: 'test#0000',
    };
    chai.request(serverURL)
        .post('/user/signup')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 200 if all goes well', (done) => {
    const body = {
      nickname: 'test2',
      tag: '0002',
      tagname: 'test2#0002',
    };
    chai.request(serverURL)
        .post('/user/signup')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          User.findOneAndDelete({tag: '0002'}, (err, user) =>{
            done();
          });
        });
  });
});

describe('Check updateUser function of UserController,js', () => {
  it('Should return 400 if missing params', (done) => {
    const body = {};
    chai.request(serverURL)
        .put('/user/update')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 404 if no User found', (done) => {
    const body = {
      nickname: 'test2',
      tag: '0002',
      tagname: 'test2#0002',
      password: '0000',
    };
    chai.request(serverURL)
        .put('/user/update')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
  });

  it('Should return 200 if all goes well', (done) => {
    const body = {
      nickname: 'test',
      tag: '0000',
      tagname: 'test#0000',
      password: '0000',
    };
    chai.request(serverURL)
        .put('/user/update')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });
});

describe('Check getUsers', () => {
  it('Should return 200 if all goes well', (done) => {
    chai.request(serverURL)
        .get('/user/all')
        .set('token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });
});

describe('Check getUserByTag', () => {
  it('Should return 200 if all goes well', (done) => {
    chai.request(serverURL)
        .get('/user/' + testUser.tag)
        .set('token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });
});

after('[Test-User] Removing test objects', (done) => {
  testUser.remove().then((removed) => {
    testAdmin.remove().then((removed) => {
      done();
    });
  });
});
