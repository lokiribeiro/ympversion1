import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Users } from './collection';

if (Meteor.isServer) {
   Meteor.publish('users', function(options, searchString) {
   const selector = {};

   if (typeof searchString === 'string' && searchString.length) {
    selector.username = {
      $regex: `.*${searchString}.*`,
      $options : 'i'
    };
  }

   Counts.publish(this, 'numberOfUsers', Users.find(selector), {
    noReady: true
  });

   return Users.find(selector, options);
 });
}