import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './TrackingPanel.styl';

class TrackingPanel extends Component {
  getTimeStringBySeconds (sec) {
    let seconds, minutes, hours;
    const result = [];

    seconds = sec%60;
    minutes = Math.floor(sec/60)%60;
    hours = Math.floor(sec/3600);

    if (hours) {
      result.push(`${hours} h.`);
    }
    if (minutes) {
      result.push(`${minutes} m.`);
    }
    result.push(`${seconds} s.`);

    return result.join(' ');
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
        {item.label}: <span className="time">{this.getTimeStringBySeconds(item.time)}</span>
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
