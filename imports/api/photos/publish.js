import { Meteor } from 'meteor/meteor';

import { Photos } from './collection';

if (Meteor.isServer) {
   Meteor.publish('photos', function() {
   var selector = {};

   return Photos.find(selector);
 });
}