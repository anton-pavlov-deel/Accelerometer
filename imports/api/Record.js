import _ from 'lodash';

export default class Record {
  constructor({
    maxBufferSize,
    maxRecordSize,
  }, updateCallback, crashCallback) {

    this.config = {
      maxBufferSize,
      maxRecordSize,
    };

    this.recording = false;

    this.record = {
      X: [],
      Y: [],
      Z: [],
    };

    this.X = [];
    this.Y = [];
    this.Z = [];
    this.middleValue = [];

    this.updateCallback = updateCallback;
    this.crashCallback = crashCallback;
    this.handleDeviceMotion = this.handleDeviceMotion.bind(this);
  }

  start(recording) {
    if (recording) {
      this.record.X = [];
      this.record.Y = [];
      this.record.Z = [];
      this.recording = true;
    }
    this.X = [];
    this.Y = [];
    this.Z = [];
    this.startTime = _.now();
    this.listenToAccelerometer();
  }

  stop() {
    this.endTime = _.now();
    this.recording = false;
    window.removeEventListener('devicemotion', this.handleDeviceMotion);
  }

  getTime() {
    return (_.now() - this.startTime);
  }

  listenToAccelerometer() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleDeviceMotion);
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
    this.updateCallback(this.actualTime);
  }

  addData(data) {
    const time = this.actualTime/1000;
    const middleValue = (Math.abs(data.X) + Math.abs(data.Y) + Math.abs(data.Z))/3.0;

    this.X.push([time, data.X]);
    this.Y.push([time, data.Y]);
    this.Z.push([time, data.Z]);
    this.middleValue.push([time, middleValue]);

    if (this.recording) {
      this.record.X.push([time, data.X]);
      this.record.Y.push([time, data.Y]);
      this.record.Z.push([time, data.Z]);
    }

    if (this.X.length > this.config.maxBufferSize) {
      this.X.shift();
      this.Y.shift();
      this.Z.shift();

      if (!this.recording) {
        this.middleValue.shift();
      }
    }

    if (this.recording && this.record.X.length > this.config.maxRecordSize) {
      this.crashCallback();
    }
  }

  getData() {
    return {
      X: this.X,
      Y: this.Y,
      Z: this.Z,
      middleValue: this.middleValue,
    };
  }

  getRecordedData() {
    return {
      ...this.record,
      middleValue: this.middleValue,
    }
  }
}
