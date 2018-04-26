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

  getTrackInfo(type) {
    if (type) {
      return this.types[type];
    }
    return this.types;
  }
}
