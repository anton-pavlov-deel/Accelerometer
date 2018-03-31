import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import Graph from '../imports/ui/Graph';
import _ from 'lodash';
import Button from '../imports/ui/Button';

Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});

class App extends Component {
  constructor(props) {
    super(props);

    this.minDataValue = 10;
    this.maxDataBufferSize = 200;
    this.timeInterval = 10000;
    this.startTime = _.now();
    this.actualTime = this.getTime();
    this.actualData = {
      X: [],
      Y: [],
      Z: []
    };

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
    this.configureOptions();
    this.update();
  }

  addActualData(data) {
    const time = this.actualTime;
    this.actualData.X.push([time/1000, data.X]);
    this.actualData.Y.push([time/1000, data.Y]);
    this.actualData.Z.push([time/1000, data.Z]);
    if (this.actualData.X.length > this.maxDataBufferSize) {
      this.actualData.X.shift();
      this.actualData.Y.shift();
      this.actualData.Z.shift();
    }
  }

  getTime() {
    return (_.now() - this.startTime);
  }

  configureOptions() {
    if (this.actualData.X.length) {
      const maxX = Math.max(...this.actualData.X);
      const maxY = Math.max(...this.actualData.Y);
      const maxZ = Math.max(...this.actualData.Z);
      const maxData = Math.max(maxX, maxY, maxZ, this.minDataValue);

      this.options = {
        yaxis: {max: this.minDataValue, min: -this.minDataValue},
        xaxis: {max: (this.actualTime + this.timeInterval)/1000, min: (this.actualTime - this.timeInterval)/1000}
      }
    }
  }

  update() {
    this.setState({
      time: this.actualTime
    })
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
        <Button />
      </div>
    );
  }
}
