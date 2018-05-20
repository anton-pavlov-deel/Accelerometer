import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';

const Tracks = new Mongo.Collection('tracks');

Meteor.methods({
  'tracks.update'(args) {
    return new Promise((resolve, reject) => {
      const {
        username,
        trackInfo,
      } = args;

      const date = moment().format('YYYY-MM-DD');
      const foundTrack = Tracks.find({ username, date }).count();

      if (foundTrack) {
        Tracks.update({ username, date }, { $set: { track: JSON.stringify(trackInfo) } });
        resolve();
      } else {
        Tracks.insert({
          username,
          date,
          track: JSON.stringify(trackInfo),
        });
        resolve();
      }
    });
  },

  'tracks.fetch'(args) {
    return new Promise((resolve, reject) => {
      const { username, date } = args;
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const foundTrack = Tracks.find({ username, date: formattedDate }).fetch();

      if (foundTrack.length) {
        const trackInfo = JSON.parse(foundTrack[0].track);

        resolve(trackInfo);
      } else {
        throw new Meteor.Error('new-data', 'Data not found');
      }
    });
  }
});
