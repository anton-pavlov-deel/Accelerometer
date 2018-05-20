import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Notification.styl';

class Notification extends Component {
  render () {
    const {
      message,
      visible,
      type,
    } = this.props;

    return (
      <div className="notification__container">
        <div
          className={
            classNames(
              'notification__block',
              {
                '-alert': type === 'alert',
                '-error': type === 'error',
                '-success': type === 'success',
                '-visible': visible,
                '-invisible': !visible,
              }
            )
          }
          >
            {message}
          </div>
      </div>
    );
  }
}

Notification.propTypes = {
  message: PropTypes.string,
  visible: PropTypes.bool,
  type: PropTypes.string,
};

export default Notification;
