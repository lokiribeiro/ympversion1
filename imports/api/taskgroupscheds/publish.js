import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Taskgroupscheds } from './collection';

if (Meteor.isServer) {
    Meteor.publish('taskgroupscheds', function() {
        var selector = {};
     
        return Taskgroupscheds.find(selector);
      });
}