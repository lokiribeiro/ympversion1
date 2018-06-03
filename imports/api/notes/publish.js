import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Notes } from './collection';

if (Meteor.isServer) {
   Meteor.publish('notes', function(options, boatID) {
    var selector = {boatID: boatID};

   Counts.publish(this, 'numberOfNotes', Notes.find(selector), {
    noReady: true
  });

   return Notes.find(selector, options);
 });
}