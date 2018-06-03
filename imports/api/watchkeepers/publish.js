import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Watchkeepers } from './collection';

if (Meteor.isServer) {
    Meteor.publish('watchkeepers', function() {
        var selector = {};
     
        return Watchkeepers.find(selector);
      });
}