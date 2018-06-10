import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Jobs } from './collection';

if (Meteor.isServer) {
  Meteor.publish('jobs', function (options, searchString, dateFrom, dateTo) {
    //var selector = {status: false};
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
          {
            $or: [
              { title: search },
              { group: search },
              { location: search },
              { modelNumber: search },
              { hours: search },
              { years: search },
              { serialNumber: search },
              { manufacturer: search },
              { status: search }
            ]
          }
        ]
      };
    } else {
      selector = {
        $or: [
          { title: search },
          { group: search },
          { location: search },
          { modelNumber: search },
          { hours: search },
          { years: search },
          { serialNumber: search },
          { manufacturer: search },
          { status: search }
        ]
      };
    }

    Counts.publish(this, 'numberOfJobs', Jobs.find(selector), {
      noReady: true
    });

    return Jobs.find(selector, options);
  });

  Meteor.publish('jobsList', function (options) {
    //var selector = {status: false};
    var selector = {};
    return Jobs.find(selector, options);
  });
}