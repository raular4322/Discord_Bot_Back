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
  nickname: 'testAdmin1',
  tag: '1000',
  tagname: 'test#0000',
  password: '0000',
});

before((done) => {
  db = mongoose.connect('mongodb://localhost:27017/discord_bot', {useNewUrlParser: true}).then(() => {
    testAdmin.save().then((saved) => {
      done();
    });
  });
});

describe('Check login function of adminController.js', () => {
  it('Should return 400 if no params are send', (done) => {
    const body = {};
    chai.request(serverURL)
        .post('/admin/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 400 if admin not found', (done) => {
    const body = {
      nickname: 'test1',
      tag: '0001',
      tagname: 'test1#0001',
      password: '0000',
    };
    chai.request(serverURL)
        .post('/admin/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 401 if unauthorized', (done) => {
    const body = {
      nickname: 'testAdmin1',
      tag: '1000',
      tagname: 'test#0000',
      password: '1111',
    };
    chai.request(serverURL)
        .post('/admin/login')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
  });

  it('Should return 200 if all goes well', (done) => {
    const body = {
      nickname: 'testAdmin1',
      tag: '1000',
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

describe('Check signup function of adminController.js', () => {
  it('Should return 400 if no params are send', (done) => {
    const body = {};
    chai.request(serverURL)
        .post('/admin/signup')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 401 if masterKey is not valid', (done) => {
    const body = {masterKey: config.MASTERKEY};
    chai.request(serverURL)
        .post('/admin/signup')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 400 if admin already exist', (done) => {
    const body = {
      nickname: 'testAdmin1',
      tag: '1000',
      tagname: 'test#0000',
      password: '0000',
      masterKey: config.MASTERKEY,
    };
    chai.request(serverURL)
        .post('/admin/signup')
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
      password: '0000',
      masterKey: config.MASTERKEY,
    };
    chai.request(serverURL)
        .post('/admin/signup')
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          Admin.findOneAndDelete({tag: '0002'}, (err, user) =>{
            done();
          });
        });
  });
});

describe('Check updateAdmin function of adminController,js', () => {
  it('Should return 400 if missing params', (done) => {
    const body = {};
    chai.request(serverURL)
        .put('/admin/update')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
  });

  it('Should return 404 if no admin found', (done) => {
    const body = {
      nickname: 'test2',
      tag: '0002',
      tagname: 'test2#0002',
      password: '0000',
    };
    chai.request(serverURL)
        .put('/admin/update')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
  });

  it('Should return 200 if all goes well', (done) => {
    const body = {
      nickname: 'testAdmin1',
      tag: '1000',
      tagname: 'test#0000',
      password: '0000',
    };
    chai.request(serverURL)
        .put('/admin/update')
        .set('token', token)
        .send(body)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });
});

describe('Check getAdmins', () => {
  it('Should return 200 if all goes well', (done) => {
    chai.request(serverURL)
        .get('/admin/all')
        .set('token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });
});

describe('Check getAdminByTag', () => {
  it('Should return 200 if all goes well', (done) => {
    chai.request(serverURL)
        .get('/admin/' + testAdmin.tag)
        .set('token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });
});

after('[Test-Admin] Removing test objects', (done) => {
  testAdmin.remove().then((removed) => {
    done();
  });
});
