'use strict';

const bluebird = require('bluebird');
const Sequelize = require('sequelize');

const MusicGenre = require('../../db/models/MusicGenre');
const Track = require('../../db/models/Track');
const Vote = require('../../db/models/Vote');

const musicPlayerService = require('../services/musicPlayer');

module.exports = createManager();

function createManager() {
  const manager = {};

  manager.create = create;
  manager.random = random;
  manager.upvote = upvote;

  return manager;

  // ------------------------------------------------------

  function create(data) {
    const musicGenreId = data.musicGenreId;
    const trackUrl = data.track.url;
    const trackService = musicPlayerService.parseTrackUrl(trackUrl);
    const trackToCreate = {
      serviceName: trackService.name,
      serviceTrackId: trackService.trackId,
    };

    return MusicGenre.findById(musicGenreId)
      .then(musicGenre => {
        if (!musicGenre) {
          return bluebird.reject({
            status: 404,
            code: 'music-genre-not-found',
            message: 'The music genre in which to add the track does not exist.',
            payload: { data },
          });
        }

        return createTrackIntoMusicGenre(trackToCreate, musicGenre);
      });
  }

  function createTrackIntoMusicGenre(trackToCreate, musicGenre) {
    return Track.findOne({
      attributes: ['id', 'serviceName', 'serviceTrackId'],
      where: {
        serviceName: trackToCreate.serviceName,
        serviceTrackId: trackToCreate.serviceTrackId,
      },
      include: [{
        model: MusicGenre,
        where: { id: musicGenre.id },
        attributes: ['id', 'name', 'slug'],
      }],
    })
      .then(track => {
        if (!track) {
          return Track.create(trackToCreate);
        }
        return bluebird.reject({
          message: `Track already listed in "${musicGenre.name}"`,
          code: 'track-already-listed',
          payload: { track },
        });
      })
      .then(track => musicGenre.addTrack(track).return(track));
  }

  // ------------------------------------------------------

  function random() {
    return Track.find({
      attributes: ['id', 'serviceName', 'serviceTrackId', 'upvotes'],
      order: [
        Sequelize.fn('RAND'),
      ],
      include: {
        model: MusicGenre,
        attributes: ['id', 'name', 'slug'],
      },
    })
      .then(res => {
        const track = res.toJSON();
        track.musicGenre = track.music_genre;
        delete track.music_genre;
        return track;
      });
  }

  // ------------------------------------------------------

  function upvote(data) {
    const trackId = data.trackId;
    const userHash = data.userHash;

    return bluebird.props({
      vote: Vote.findOne({ where: { userHash, trackId } }),
      track: Track.findById(trackId, { attributes: ['id', 'upvotes'] }),
    })
      .then(res => {
        if (!res.track) {
          return bluebird.reject({
            status: 404,
            code: 'track-not-found',
            message: 'The track to upvote has not been found.',
            payload: { data },
          });
        }
        if (res.vote) {
          return bluebird.reject({
            message: 'This client has already voted for that track',
            code: 'already-voted',
            payload: { track: res.track },
          });
        }

        return bluebird.props({
          registerVote: registerVote(res.track, userHash),
          incrementVoteCount: incrementVoteCount(res.track),
        });
      })
      .then(res => {
        return { upvotes: res.incrementVoteCount.upvotes };
      });
  }

  function registerVote(track, userHash) {
    return Vote.create({ userHash })
      .then(vote => track.addVote(vote));
  }

  function incrementVoteCount(track) {
    track.upvotes += 1;
    return track.save();
  }
}