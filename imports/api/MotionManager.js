export default class MotionManager {
  constructor({
    motionTypes,
    motionValueRange = 10,
  }) {
    this.motionTypes = motionTypes;
    this.motionTypes.setDefaultMotionTypes();
    this.motionType = '';

    this.motionValue = 0.0;
    this.motionValueRange = motionValueRange;
  }

  calculateMotionValue(record) {
    const {
      middleValue,
    } = record;

    const toDrop = middleValue.length - this.motionValueRange;
    let motionCoefs = 0.0;
    let motionValueCut;

    if (toDrop >= 0) {
      motionValueCut = _.drop(middleValue, toDrop);

      for (let i=0; i<this.motionValueRange-1; i++) {
        const coef = Math.abs((motionValueCut[i+1][1] - motionValueCut[i][1])/(motionValueCut[i+1][0] - motionValueCut[i][0]));
        motionCoefs += coef;
      }

      this.motionValue = motionCoefs/this.motionValueRange;
    }
  }

  getMotionValue(record) {
    this.calculateMotionValue(record);

    return this.motionValue;
  }

  setMotionType() {
    this.motionType = this.motionTypes.getTypeByThreshold(this.motionValue).name;
  }

  getMotionType(record) {
    this.calculateMotionValue(record);
    this.setMotionType();

    return this.motionType;
  }
}
