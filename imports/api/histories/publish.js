import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Histories } from './collection';

if (Meteor.isServer) {
  Meteor.publish('histories', function (options, searchString) {
    var selector = {};

    if (typeof searchString === 'string' && searchString.length) {
      var search = { $regex: `.*${searchString}.*`, $options: 'i' };
      selector = {
        $or: [
          { title: search },
          { group: search },
          { workHistory: search }
        ]
      };
    }

    Counts.publish(this, 'numberOfHistories', Histories.find(selector), {
      noReady: true
    });

    return Histories.find(selector, options);
  });

  Meteor.publish('reportshistory', function (options, searchString, dateFrom, dateTo) {
    var selector = {};
    var search = { $regex: `.*${searchString}.*`, $options: 'i' };

    if (typeof dateFrom === 'number' && typeof dateTo === 'number') {
      var selector = {
        $and: [
          {
            dateTime: {
              $gte: dateFrom,
              $lte: dateTo
            }
          },
          { userID: search }
        ]
      };
    } else {
      selector = { userID: search };
    }

    Counts.publish(this, 'numberOfReportsHistory', Histories.find(selector), {
      noReady: true
    });

    return Histories.find(selector, options);
  });
}