import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Ympsubgroups } from './collection';

if (Meteor.isServer) {
    Meteor.publish('ympsubgroups', function() {
        var selector = {};
     
        return Ympsubgroups.find(selector);
      });
}