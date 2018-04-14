import _ from 'lodash';

class Record {
  constructor({
    maxRecordSize,
    slidable,
  }) {
    this.config = {
      maxRecordSize,
      slidable,
    };
    this.X = [];
    this.Y = [];
    this.Z = [];
    this.middleValue = [];
  }

  start() {
    this.startTime = _.now();
    this.listenToAccelerometer();
  }

  stop() {
    this.endTime = _.now();
    window.removeEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
  }

  getTime() {
    return (_.now() - this.startTime);
  }

  listenToAccelerometer() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
    }
  }

  handleDeviceMotion(event) {
    let { x, y, z } = event.accelerationIncludingGravity;

    x = x ? x : 0;
    y = y ? y : 0;
    z = z ? z : 0;

    const data = {X: x, Y: y, Z: z};
    this.actualTime = this.getTime();
    this.addData(data);
  }

  addData(data) {
    const time = this.actualTime/1000;
    const middleValue = (Math.abs(data.X) + Math.abs(data.Y) + Math.abs(data.Z))/3.0;

    this.X.push([time, data.X]);
    this.Y.push([time, data.Y]);
    this.Z.push([time, data.Z]);
    this.middleValue.push([time, middleValue]);

    if (this.config.slidable && this.X.length > this.config.maxRecordSize) {
      this.X.shift();
      this.Y.shift();
      this.Z.shift();

      this.middleValue.shift();
    } else if (!this.config.slidable) {
      this.stop();
    }
  }
}
