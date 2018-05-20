import _ from 'lodash';

export default class Track {
  constructor(trackTypes) {
    this.types = {};

    _.forEach(trackTypes, (item) => {
      this.types[item] = 0;
    });
  }

  tick(type) {
    this.types[type] += 1;
  }

  setTrackInfo(trackInfo) {
    _.forEach(trackInfo, (value, type) => {
      this.types[type] += value;
    });
  }

  getTrackInfo(type) {
    if (type) {
      return this.types[type];
    }
    return this.types;
  }
}
