import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';

import GraphsApp from './pages/graphs';

Meteor.startup(() => {
  render(<GraphsApp />, document.getElementById('root'));
});
