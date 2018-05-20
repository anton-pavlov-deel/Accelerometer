import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../ui/Button';

import './UserPanel.styl';

class UserPanel extends Component {
  render() {
    const { userName, userId, onLogOut } = this.props;

    return (
      <div className="user__panel">
        <label className="user__info">{`User: ${userName} (#${userId})`}</label>
        <Button
          label="Log out"
          className="logout__button"
          onClick={onLogOut}
        />
      </div>
    );
  }
}

UserPanel.propTypes = {
  userName: PropTypes.string,
  userId: PropTypes.number,
  onLogOut: PropTypes.func,
};

export default UserPanel;
