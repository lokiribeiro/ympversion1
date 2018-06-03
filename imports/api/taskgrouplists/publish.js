import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Taskgrouplists } from './collection';

if (Meteor.isServer) {
    Meteor.publish('taskgrouplists', function() {
        var selector = {};
     
        return Taskgrouplists.find(selector);
      });
}