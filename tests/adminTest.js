const Admin = require('../models/adminModel');
const mongoose = require('mongoose');
const {expect} = require(`chai`);
const chai = require('chai');
const chaiHttp = require(`chai-http`);
const serverURL = 'http://localhost:3000';

chai.use(chaiHttp);

let token = '';
const testAdmin = new Admin({
  nickname: 'test',
  tag: '0000',
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

  // it('Should return 200 if all goes well', (done) => {
  //   const body = {
  //     nickname: 'test2',
  //     tag: '0002',
  //     tagname: 'test2#0002',
  //     password: '0000',
  //   };
  //   chai.request(serverURL)
  //       .post('/admin/signup')
  //       .send(body)
  //       .end((err, res) => {
  //         expect(res).to.have.status(200);
  //         Admin.findOneAndDelete({tag: '0002'}, (err, user) =>{
  //           done();
  //         });
  //       });
  // });
});

after('[Test-Admin] Removing test objects', (done) => {
  testAdmin.remove().then((removed) => {
    done();
  });
});
