import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import Graph from '../../imports/ui/Graph';
import MotionTypes from '../../imports/api/MotionTypes';
import _ from 'lodash';
import Button from '../../imports/ui/Button';
import Record from '../../imports/api/Record';
import MotionManager from '../../imports/api/MotionManager';

export default class GraphsApp extends Component {
  constructor(props) {
    super(props);

    const motionTypes = new MotionTypes();
    const actualRecordConfig = {
      maxRecordSize: 100,
      slidable: true,
    };

    const motionManagerConfig = {
      motionTypes,
      motionValueRange: 10,
    };

    this.actualData = new Record(actualRecordConfig, this.update.bind(this));

    this.motionManager = new MotionManager(motionManagerConfig);

    this.graphOptions = {
      minDataValue: 10,
      timeInterval: 10000,
    };

    this.state = {
      time: 0,
      tracking: false,
    };

    this.startTracking = this.startTracking.bind(this);
    this.stopTracking = this.stopTracking.bind(this);
  }

  startTracking() {
    this.setState({
      tracking: true,
    });
    this.actualData.start();
  }

  stopTracking() {
    this.setState({
      tracking: false,
    });
    this.actualData.stop();
  }

  update(time) {
    this.setState({
      time
    })
  }

  render() {
    const graphWidth = $(window).width()*95/100;
    const graphHeight = $(window).height()*30/100;

    return (
      <div className='graphs__app'>
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='X'
          className='X'
          options={{...this.graphOptions, time: this.state.time}}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='Y'
          className='Y'
          options={{...this.graphOptions, time: this.state.time}}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          dataFragment='Z'
          className='Z'
          options={{...this.graphOptions, time: this.state.time}}
        />
        <div className='button__panel'>
          <Button
            label='Start'
            onClick={this.startTracking}
            disabled={this.state.tracking}
          />
          <Button
            label='Stop'
            onClick={this.stopTracking}
            disabled={!this.state.tracking}
          />
        </div>
      </div>
    );
  }
}
