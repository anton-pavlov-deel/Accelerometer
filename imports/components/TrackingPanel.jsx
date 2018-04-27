import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class TrackingPanel extends Component {
  render () {
    const trackingPanelItems = this.props.data.map((item) => (
      <div
        id={item.type}
        className={
          classNames(
            item.type,
            'tracking__panel__item'
          )
        }
      >
        {item.label}: {item.time} 's.'
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
