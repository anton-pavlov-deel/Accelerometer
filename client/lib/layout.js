import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Notification from '../../imports/components/Notification';

class Layout extends Component {
  constructor(props) {
    super(props);

    this.notificationDefaultState = {
      showNotification: false,
      notificationMessage: '',
      notificationType: '',
    };

    this.state = this.notificationDefaultState;

    this.notify = this.notify.bind(this);
  }

  notify(type, message, timeout=2000) {
    this.setState({
      showNotification: true,
      notificationMessage: message,
      notificationType: type,
    });

    setTimeout(() => {
      this.setState(this.notificationDefaultState);
    }, timeout);
  }

  render() {
    const AppBody = this.props.content
    const { showNotification, notificationMessage, notificationType } = this.state;
    const appStyle = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    return (
      <div className="appLayout" style={appStyle}>
        <Notification
          message={notificationMessage}
          visible={showNotification}
          type={notificationType}
        />
        <AppBody notify={this.notify}/>
      </div>
    );
  }
}

Layout.propTypes = {
  content: PropTypes.component,
}

export default Layout;
