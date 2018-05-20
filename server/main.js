import { Meteor } from 'meteor/meteor';
import '../imports/collections/users';
import '../imports/collections/tracks';

Meteor.startup(() => {

});

Meteor.methods({
  'pingServer'() {
    console.log('PING');
  }
});
