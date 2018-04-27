import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './TrackingPanel.styl';

class TrackingPanel extends Component {
  getTimeStringBySeconds (sec) {
    let days=0, hours=0, minutes=0, seconds=0;
    let result;

    if (sec === 0) {
      return '0 s.';
    }
    if (sec >= 60) {
      seconds = sec%60;
      minutes = Math.round(sec/60);
      result = `${seconds} s.`;
    }
    if (minutes >= 60) {
      hours = Math.round(minutes/60);
      minutes = minutes%60;
      result = `${minutes} m. ` + result;
    }
    if (hours >= 24) {
      days = Math.round(hours/24);
      hours = hours%24;
      result = `${hours} h. ` + hours;
    }

    return result;
  }

  render () {
    const trackingPanelItems = this.props.data.map((item) => (
      <div
        key={item.type}
        className={
          classNames(
            item.type,
            {'--active': item.active},
            'tracking__panel__item'
          )
        }
      >
        {item.label}: {item.time} s.
      </div>
    ));

    return (
      <div
        className={
          classNames(
            'tracking__panel',
            this.props.className
          )
        }
      >
        {trackingPanelItems}
      </div>
    );
  }
}

export default TrackingPanel;
