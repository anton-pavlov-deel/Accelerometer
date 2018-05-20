import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';

import GraphsApp from './pages/graphs';
import AuthApp from './pages/auth';

import './lib/router';

Meteor.startup(() => {
  if (Meteor.isCordova) {
    cordova.plugins.backgroundMode.enable();
  }
  FlowRouter.initialize();
  FlowRouter.go('/auth');
});
