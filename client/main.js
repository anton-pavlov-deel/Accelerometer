import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';

import App from '../imports/components/App';

Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});
