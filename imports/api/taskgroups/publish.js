import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Taskgroups } from './collection';

if (Meteor.isServer) {
    Meteor.publish('taskgroups', function() {
        var selector = {};
     
        return Taskgroups.find(selector);
      });
}