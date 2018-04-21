import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import Graph from '../../imports/ui/Graph';
import MotionTypes from '../../imports/api/MotionTypes';
import Button from '../../imports/ui/Button';
import Record from '../../imports/api/Record';
import MotionManager from '../../imports/api/MotionManager';

export default class GraphsApp extends Component {
  constructor(props) {
    super(props);

    const motionTypes = new MotionTypes();

    const actualDataConfig = {
      maxBufferSize: 110,
      maxRecordSize: 110,
    };

    const motionManagerConfig = {
      motionTypes,
      motionValueRange: 20,
    };

    this.actualData = new Record(actualDataConfig, this.update.bind(this), this.switchRecording.bind(this));
    this.actualData.start();

    this.motionManager = new MotionManager(motionManagerConfig);

    this.graphOptions = {
      minDataValue: 10,
      timeInterval: 10000,
    };

    this.state = {
      time: 0,
      recording: false,
      hasRecord: false,
    };

    this.switchRecording = this.switchRecording.bind(this);
    this.switchShowRecord = this.switchShowRecord.bind(this);
  }

  switchRecording() {
    if (this.state.recording) {
      this.actualData.stop();
      this.recordedData = this.actualData.getRecordedData();
      this.setState({
        recording: false,
        hasRecord: true,
      });
      this.actualData.start();
    } else {
      this.actualData.stop();
      this.setState({
        recording: true,
        showRecord: false,
        hasRecord: false,
      });
      this.actualData.start(true);
    }
  }

  switchShowRecord() {
    if (this.state.showRecord) {
      this.actualData.stop();
      this.setState({
        showRecord: false,
      });
      this.actualData.start();
    } else {
      this.actualData.stop();
      this.setState({
        showRecord: true,
      });
      this.actualData.start();
    }
  }

  update(time) {
    this.setState({
      time
    })
  }

  render() {
    const graphWidth = $(window).width()*95/100;
    const graphHeight = $(window).height()*30/100;
    const motionValue = this.motionManager.getMotionValue(this.actualData.getData());
    const motionType = this.motionManager.getMotionType(this.actualData.getData());

    return (
      <div className='graphs__app'>
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          recordData={this.state.showRecord ? this.recordedData : undefined}
          dataFragment='X'
          className='X'
          options={{...this.graphOptions, time: this.state.time}}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          recordData={this.state.showRecord ? this.recordedData : undefined}
          dataFragment='Y'
          className='Y'
          options={{...this.graphOptions, time: this.state.time}}
        />
        <Graph
          height={graphHeight}
          width={graphWidth}
          actualData={this.actualData.getData()}
          recordData={this.state.showRecord ? this.recordedData : undefined}
          dataFragment='Z'
          className='Z'
          options={{...this.graphOptions, time: this.state.time}}
        />
        <div className='motion_status__panel'>
          <div className='motion_type subpanel'>
            Motion type: <span>{motionType}</span>
          </div>
          <div className='motion_value subpanel'>
            Motion value: <span>{motionValue}</span>
          </div>
        </div>
        <div className='button__panel'>
          <Button
            label={this.state.recording ? 'Stop' : 'Start'}
            className={
              classNames(
                'record__button',
                {'--recording': this.state.recording}
              )
            }
            onClick={this.switchRecording}
          />
          <Button
            label={this.state.showRecord ? 'Hide record' : 'Show record'}
            disabled={!this.state.hasRecord}
            className={
              classNames(
                'show_record__button',
              )
            }
            onClick={this.switchShowRecord}
          />
        </div>
      </div>
    );
  }
}
