import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Subgroups } from './collection';

if (Meteor.isServer) {
    Meteor.publish('subgroups', function() {
        var selector = {};
     
        return Subgroups.find(selector);
      });
}