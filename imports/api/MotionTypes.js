import _ from 'lodash';

export default class MotionTypes {
  setDefaultMotionTypes() {
    this.types = [
      {
        name: 'calm',
        threshold: 0.0
      },

      {
        name: 'walking',
        threshold: 6.0
      },

      {
        name: 'running',
        threshold: 15.0
      }
    ]
  }

  addType(name, threshold) {
    this.types.push({name, threshold});
    this.types = _.sortBy(this.types, object => (object.threshold));
  }

  getTypeByName(name) {
    const index = _.findIndex(this.types, object => (object.name === name));

    return index !== -1 ? this.types[index] : undefined;
  }

  getTypeByThreshold(threshold) {
    let resultType = this.types[0];

    this.types.forEach(type => {
      if (threshold > type.threshold) {
        resultType = type;
      }
    });

    return resultType;
  }
}
