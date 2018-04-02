import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import Graph from '../imports/ui/Graph';
import MotionTypes from '../imports/api/MotionTypes';
import _ from 'lodash';
import Button from '../imports/ui/Button';

Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});

class App extends Component {
  constructor(props) {
    super(props);

    this.minDataValue = 10;
    this.maxDataBufferSize = 195;
    this.timeInterval = 10000;
    this.startTime = _.now();
    this.actualTime = this.getTime();
    this.actualData = {
      X: [],
      Y: [],
      Z: []
    };
    this.middleValue = [];

    this.MotionTypes = new MotionTypes();
    this.MotionTypes.setDefaultMotionTypes();
    this.motionType = '';

    this.currentMotionValue = 0.0;
    this.currentMotionValueRange = 20;

    this.options = {
      yaxis: {max: this.minDataValue, min: -this.minDataValue},
      xaxis: {max: (this.actualTime + this.timeInterval)/1000, min: (this.actualTime - this.timeInterval)/1000}
    };

    this.state = {
      time: this.actualTime
    };

    //setInterval(this.handleDeviceMotion.bind(this, {accelerationIncludingGravity:{x:0,y:0,z:0}}), 50);

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
    this.addActualData(data);
    this.calculateMotionValue();
    this.setMotionType();
    this.configureOptions();
    this.update();
  }

  addActualData(data) {
    const time = this.actualTime/1000;
    const middleValue = (Math.abs(data.X) + Math.abs(data.Y) + Math.abs(data.Z))/3.0;

    this.actualData.X.push([time, data.X]);
    this.actualData.Y.push([time, data.Y]);
    this.actualData.Z.push([time, data.Z]);
    this.middleValue.push([time, middleValue]);

    if (this.actualData.X.length > this.maxDataBufferSize) {
      this.actualData.X.shift();
      this.actualData.Y.shift();
      this.actualData.Z.shift();

      this.middleValue.shift();
    }
  }

  getTime() {
    return (_.now() - this.startTime);
  }

  configureOptions() {
    if (this.actualData.X.length) {
      const maxX = Math.max(...this.actualData.X.map(item => item[1]));
      const maxY = Math.max(...this.actualData.Y.map(item => item[1]));
      const maxZ = Math.max(...this.actualData.Z.map(item => item[1]));
      const maxData = Math.max(maxX, maxY, maxZ, this.minDataValue);

      this.options = {
        yaxis: {max: maxData, min: -maxData},
        xaxis: {max: (this.actualTime + this.timeInterval)/1000, min: (this.actualTime - this.timeInterval)/1000}
      }
    }
  }

  update() {
    this.setState({
      time: this.actualTime
    })
  }

  calculateMotionValue() {
    const toDrop = this.middleValue.length - this.currentMotionValueRange;
    let motionCoefs = 0.0;
    let motionValueCut;

    if (toDrop >= 0) {
      motionValueCut = _.drop(this.middleValue, toDrop);

      for (let i=0; i<this.currentMotionValueRange-1; i++) {
        const coef = Math.abs((motionValueCut[i+1][1] - motionValueCut[i][1])/(motionValueCut[i+1][0] - motionValueCut[i][0]));
        motionCoefs += coef;
      }

      this.currentMotionValue = motionCoefs/this.currentMotionValueRange;
    }
  }

  setMotionType() {
    this.motionType = this.MotionTypes.getTypeByThreshold(this.currentMotionValue).name;
  }

  render() {
    const graphWidth = $(window).width()*95/100;
    const graphHeight = $(window).height()*30/100;

    return (
      <div>
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.X}
          className='X'
          options={this.options}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.Y}
          className='Y'
          options={this.options}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.Z}
          className='Z'
          options={this.options}
        />
        {this.currentMotionValue}<br />
        {this.motionType}
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.middleValue}
          className='MIDDLE'
          options={this.options}
        />
	<Button />
      </div>
    );
  }
}
