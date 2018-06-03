import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Groups } from './collection';

if (Meteor.isServer) {
    Meteor.publish('groups', function() {
        var selector = {};
     
        return Groups.find(selector);
      });
}