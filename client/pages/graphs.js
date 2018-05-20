import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Database from '../../imports/api/Database';
import Graph from '../../imports/ui/Graph';
import MotionTypes from '../../imports/api/MotionTypes';
import Button from '../../imports/ui/Button';
import Record from '../../imports/api/Record';
import MotionManager from '../../imports/api/MotionManager';
import Track from '../../imports/api/Track.js';
import TrackingPanel from '../../imports/components/TrackingPanel.jsx';
import UserPanel from '../../imports/components/UserPanel.js';

import '../../imports/collections/tracks.js';

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

    this.db = Database('track');

    this.actualData = new Record(actualDataConfig, this.update.bind(this), this.switchRecording.bind(this));
    this.actualData.start();

    this.motionManager = new MotionManager(motionManagerConfig);

    this.track = new Track(['calm', 'walking', 'running']);
    if (Meteor.userId !== -1) {
      this.fetchTrackInfo();
    }

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

    this.updateCounter = 0;

    this.switchRecording = this.switchRecording.bind(this);
    this.switchShowRecord = this.switchShowRecord.bind(this);
    this.switchTracking = this.switchTracking.bind(this);

    this.notify = props.notify;
  }

  logOut() {
    Meteor.userName = '';
    Meteor.userId = 0;
    FlowRouter.go('/auth');
  }

  fetchTrackInfo() {
    const username = Meteor.userName;
    const date = new Date();

    Meteor.call('tracks.fetch', { username, date }, (err, result) => {
      if (err) {
        //this.notify('alert', err.reason);
      } else {
        this.track.setTrackInfo(result);
        //this.notify('success', 'Track info was fetched for today');
      }
    });
  }

  updateTrackInfo() {
    const username = Meteor.userName;
    const trackInfo = this.track.getTrackInfo();

    Meteor.call('tracks.update', { username, trackInfo }, (err, result) => {
      if (err) {
        this.notify('error', err.reason);
      }
    });
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
      this.updateCounter += 1;
      if (this.updateCounter === 5 && Meteor.userId !== -1) {
        this.updateCounter = 0;
        this.updateTrackInfo();
      }

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
    const { userName, userId } = Meteor;

    const trackingData = _.keys(trackInfo).map((type) => ({
      type,
      label: type[0].toUpperCase() + type.slice(1),
      time: trackInfo[type],
      active: type === motionType,
    }));

    return (
      <div className='graphs__app'>
        <h1 className='header'>Tracker-o-meter</h1>
        <UserPanel
          userName={userName}
          userId={userId}
          onLogOut={this.logOut}
        />
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
