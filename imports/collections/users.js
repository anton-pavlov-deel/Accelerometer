import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Users = new Mongo.Collection('users');

Meteor.methods({
  'users.insert'(userData) {
    return new Promise((resolve, reject) => {
      const {
        password,
        username,
      } = userData;

      const foundUser = Users.find({ username }).count();
      if (foundUser) {
        throw new Meteor.Error('user-exists', `User with name '${username}' already exists`);
      }

      const _id = `${Users.find().count()}`;
      const createdAt = new Date();
      Users.insert({
        _id,
        password,
        username,
        createdAt,
      });

      resolve({
        _id,
        password,
        username,
        createdAt,
      });
    });
  },

  'users.auth'(userData) {
    return new Promise((resolve, reject) => {
      const {
        username,
        password,
      } = userData;
      const user = Users.find({ username }).fetch();

      if (user && user.length) {
        if (user[0].password === password) {
          resolve(user[0]);
        } else {
          throw new Meteor.Error('incorrect-password', 'Incorrect password');
        }
      }
      throw new Meteor.Error('incorrect-username', 'Unknown user');
    });
  }
});
