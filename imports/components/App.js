import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import Graph from '../ui/Graph';
import MotionTypes from '../api/MotionTypes';
import _ from 'lodash';
import Button from '../ui/Button';
import Record from '../api/Record';
import MotionManager from '../api/MotionManager';

export default class App extends Component {
  constructor(props) {
    super(props);

    const motionTypes = new MotionTypes();
    const actualRecordConfig = {
      maxRecordSize: 30,
      slidable: true,
    };

    const motionManagerConfig = {
      motionTypes,
      motionValueRange: 10,
    };

    this.actualData = new Record(actualRecordConfig, this.update.bind(this));
    this.actualData.start();

    this.motionManager = new MotionManager(motionManagerConfig);

    this.graphOptions = {
      minDataValue: 10,
      timeInterval: 10000,
    };

    this.state = {
      time: 0
    };
    //setInterval(this.handleDeviceMotion.bind(this, {accelerationIncludingGravity:{x:0,y:0,z:0}}), 50);
  }

  update(time) {
    this.setState({
      time
    })
  }

  render() {
    const graphWidth = $(window).width()*95/100;
    const graphHeight = $(window).height()*30/100;
    const currentMotionValue = this.motionManager.getMotionValue(this.actualData.getData());
    const motionType = this.motionManager.getMotionType(this.actualData.getData());

    return (
      <div>
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='X'
          className='X'
          options={{...this.options, time: this.state.time}}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='Y'
          className='Y'
          options={{...this.options, time: this.state.time}}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='Z'
          className='Z'
          options={{...this.options, time: this.state.time}}
        />
        {currentMotionValue}<br />
        {motionType}
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='middleValue'
          className='MIDDLE'
          options={{...this.options, time: this.state.time}}
        />
	<Button />
      </div>
    );
  }
}
