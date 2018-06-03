import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Watchkeeplogs } from './collection';

if (Meteor.isServer) {
    Meteor.publish('watchkeeplogs', function(options, dateFrom, dateTo, searchString, boatID) {
        var selector = {boatID: boatID};
     
        if (typeof dateFrom === 'number' && typeof dateTo === 'number') {
            var selector = {$and: [
              {boatID: boatID},
              {dateTime: {
                $gte: dateFrom,
                $lte: dateTo
              }}
            ]};
       } else if (typeof searchString === 'string' && searchString.length) {
        var search = {$regex: `.*${searchString}.*`, $options: 'i'};
        selector = {$and: [
          {boatID: boatID},
          {
            $or: [
              {task: search},
              {taskGroup: search},
              {name: search}
            ]
          }
        ]};
      }

    Counts.publish(this, 'numberOfWatchkeeplogs', Watchkeeplogs.find(selector), {
      noReady: true
    });

    return Watchkeeplogs.find(selector, options);
  });

  Meteor.publish('singlewatchkeeplog', function(options) {
    var selector = {};

    return Watchkeeplogs.find(selector, options);
  });
}