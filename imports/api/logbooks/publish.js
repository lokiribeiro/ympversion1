import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Logbooks } from './collection';

if (Meteor.isServer) {
    Meteor.publish('logbooks', function(options, dateFrom, dateTo, searchString) {
        var selector = {};
     
        if (typeof dateFrom === 'number' && typeof dateTo === 'number') {
            var selector = {dateTime: {
                $gte: dateFrom,
                $lte: dateTo
              }};
       } else if (typeof searchString === 'string' && searchString.length) {
        var search = {$regex: `.*${searchString}.*`, $options: 'i'};
        selector = {notes: search};
        }

  Counts.publish(this, 'numberOfLogbooks', Logbooks.find(selector), {
   noReady: true
 });

  return Logbooks.find(selector, options);
});
}