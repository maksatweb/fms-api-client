const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const environment = require('dotenv');
const varium = require('varium');
const { connect } = require('marpat');
const { Filemaker } = require('../filemaker');
const { expect, should } = require('chai');

chai.use(chaiAsPromised);

describe('FileMaker Data API Client', () => {
  let database = null;
  before(done => {
    environment.config({ path: './tests/.env' });
    varium(process.env, './tests/env.manifest');
    connect('nedb://memory')
      .then(db => {
        database = db;
        return database.dropDatabase();
      })
      .then(() => {
        return done();
      });
  });

  beforeEach(done => {
    filemaker = Filemaker.create({
      application: process.env.APPLICATION,
      server: process.env.SERVER,
      _username: process.env.USERNAME,
      _password: process.env.PASSWORD,
      _layout: process.env.LAYOUT
    });
    done();
  });

  it('should allow an instance to be saved', () => {
    return expect(filemaker.save())
      .to.eventually.be.an('object')
      .that.has.all.keys(
        '_password',
        '_schema',
        '_username',
        '_connection',
        '_id',
        'application',
        'server',
        '_layout'
      );
  });
  it('should allow be able to get an authentication token', () => {
    return expect(filemaker.authenticate()).to.eventually.be.a('string');
  });
});
