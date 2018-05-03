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
import Track from '../../imports/api/Track.js';
import TrackingPanel from '../../imports/components/TrackingPanel.jsx';

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

    this.track = new Track(['calm', 'walking', 'running']);

    this.graphOptions = {
      minDataValue: 10,
      timeInterval: 10000,
    };

    this.state = {
      time: 0,
      lastTrackingTime: 0,
      tracking: false,
      recording: false,
      hasRecord: false,
    };

    this.switchRecording = this.switchRecording.bind(this);
    this.switchShowRecord = this.switchShowRecord.bind(this);
    this.switchTracking = this.switchTracking.bind(this);
  }

  switchTracking() {
    this.setState({
      tracking: !this.state.tracking,
    });
  }

  switchRecording() {
    if (this.state.recording) {
      this.actualData.stop();
      this.recordedData = this.actualData.getRecordedData();
      this.setState({
        lastTrackingTime: 0,
        recording: false,
        hasRecord: true,
      });
      this.actualData.start();
    } else {
      this.actualData.stop();
      this.setState({
        lastTrackingTime: 0,
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
        lastTrackingTime: 0,
        showRecord: false,
      });
      this.actualData.start();
    } else {
      this.actualData.stop();
      this.setState({
        lastTrackingTime: 0,
        showRecord: true,
      });
      this.actualData.start();
    }
  }

  update(time) {
    const delta = time - this.state.lastTrackingTime;
    if (this.state.tracking && delta >= 1000) {
      const type = this.motionManager.getMotionType(this.actualData.getData());
      this.track.tick(type);
      this.setState({
        lastTrackingTime: time,
      });
    }
    this.setState({
      time
    })
  }

  render() {
    const graphWidth = $(window).width()*95/100;
    const graphHeight = $(window).height()*30/100;
    const motionValue = this.motionManager.getMotionValue(this.actualData.getData());
    const motionType = this.motionManager.getMotionType(this.actualData.getData());
    const trackInfo = this.track.getTrackInfo();

    const trackingData = _.keys(trackInfo).map((type) => ({
      type,
      label: type[0].toUpperCase() + type.slice(1),
      time: trackInfo[type],
      active: type === motionType,
    }));

    console.log(openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024));

    return (
      <div className='graphs__app'>
        <h1 className='header'>Tracker-o-meter</h1>
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
        <TrackingPanel
          data={trackingData}
        />
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
          <Button
            label={this.state.tracking ? 'Stop tracking' : 'Start tracking'}
            className={
              classNames(
                'tracking__button'
              )
            }
            onClick={this.switchTracking}
          />
        </div>
      </div>
    );
  }
}
