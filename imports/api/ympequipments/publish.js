import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Ympequipments } from './collection';

if (Meteor.isServer) {
    Meteor.publish('ympequipments', function() {
        var selector = {};
     
        return Ympequipments.find(selector);
      });
}