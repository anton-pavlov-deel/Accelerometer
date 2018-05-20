import { FlowRouter } from 'meteor/kadira:flow-router';
import React from 'react';
import { render } from 'react-dom';

import Layout from './layout';
import AuthApp from '../pages/auth';
import GraphsApp from '../pages/graphs';

FlowRouter.wait();

FlowRouter.route('/', {
  action: function(params, queryParams) {
    FlowRouter.go('/auth');
  }
})

FlowRouter.route('/auth', {
  action: function(params, queryParams) {
    render(<Layout content={AuthApp} />, document.getElementById('root'));
  }
})

FlowRouter.route('/graphs', {
  action: function(params, queryParams) {
    render(<Layout content={GraphsApp} />, document.getElementById('root'));
  }
})
