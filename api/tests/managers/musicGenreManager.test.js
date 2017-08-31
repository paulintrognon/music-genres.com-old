'use strict';

const bluebird = require('bluebird');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const should = require('should');

const MusicGenreStub = {};
const model = proxyquire('../../managers/musicGenreManager.js', {
  '../models/MusicGenre.js': MusicGenreStub,
});

describe('musicGenreManager', () => {
  describe('.create', createSuite);
});

function createSuite() {
  it('should call the model with an added slug', test);

  function test(done) {
    const data = {
      name: 'Super weird Style.genre~lol^^',
    };
    const modelResult = {};
    MusicGenreStub.create = sinon.stub().returns(bluebird.resolve(modelResult));

    model.create(data)
      .then(res => {
        should(MusicGenreStub.create.callCount).equal(1);
        should(MusicGenreStub.create.firstCall.args).eql([
          {
            name: data.name,
            slug: 'super-weird-style-genre-lol',
          },
        ]);
        should(res).equal(modelResult);
      })
      .then(done, done);
  }
}