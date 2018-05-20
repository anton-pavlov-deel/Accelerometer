import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import classNames from 'classnames';
import { FlowRouter } from 'meteor/kadira:flow-router';

import '../../imports/collections/users.js';

export default class AuthApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      currentUser: '',
      currentUserId: '',
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.notify = props.notify;
  }

  handleInputChange(event) {
    const {
      name,
      value,
    } = event.target;

    this.setState({
      [name]: value,
    });
  }

  handleButtonPress(event) {
    const { name } = event.target;
    const { username, password } = this.state;

    if (name === 'login') {
      if (username === 'guest') {
        Meteor.userName = 'guest';
        Meteor.userId = -1;
        this.notify('success', `Successfully logged in as guest`);

        FlowRouter.go('/graphs');
      } else {
        this.notify('alert', 'Loading...', 15000);
        Meteor.call('users.auth', { username, password }, (error, userData) => {
          if (error) {
            this.notify('error', error.reason);
          } else {
            this.setState({
              loggedIn: true,
              currentUser: userData.username,
              currentUserId: userData._id,
            });

            Meteor.userName = userData.username;
            Meteor.userId = userData._id;
            this.notify('success', `${userData.username} successfully logged in`);

            FlowRouter.go('/graphs');
          }
        });
      }
    } else if (name === 'register') {
      if (username && password) {
        this.notify('alert', 'Loading...', 15000);
        Meteor.call('users.insert', {username, password}, (error, userData) => {
          if (error) {
            this.notify('error', error.reason);
          } else {
            this.notify('success', `${userData.username} registered`);
          }
        });
      } else {
        this.notify('error', 'Invalid input');
      }
    }
  }

  render() {
    const { loggedIn } = this.state;

    return (
      <div className="authApp">
        <div className="form">
          <h1 className="app__header">Tracker-o-meter</h1>
          <div className="form__field">
            <label className="form__label">Username:</label>
            <input
              type="text"
              name="username"
              className="form__input username__input"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form__field">
            <label className="form__label">Password:</label>
            <input
              type="password"
              name="password"
              className="form__input password__input"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form__button-area">
            <input
              className={
                classNames(
                  'button',
                  'login__button',
                  { '-active': !loggedIn }
                )
              }
              type="button"
              disabled={loggedIn}
              name="login"
              value="Log In"
              onClick={this.handleButtonPress}
            />
            <input
              className={
                classNames(
                  'button',
                  'register_button',
                  { '-active': !loggedIn }
                )
              }
              type="button"
              disabled={loggedIn}
              name="register"
              value="Register"
              onClick={this.handleButtonPress}
            />
          </div>
        </div>
      </div>
    );
  }
}
