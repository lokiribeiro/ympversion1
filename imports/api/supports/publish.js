import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Supports } from './collection';

if (Meteor.isServer) {
    Meteor.publish('supports', function() {
        var selector = {};
     
        return Supports.find(selector);
      });
}