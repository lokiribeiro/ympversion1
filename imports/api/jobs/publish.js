import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Jobs } from './collection';

if (Meteor.isServer) {
   Meteor.publish('jobs', function(options, searchString, dateFrom, dateTo) {
   //var selector = {status: false};
   var selector = {};

   if (typeof dateFrom === 'number' && typeof dateTo === 'number') {
    /*var selector = {$and: [
      {status: false},
      {dateTime: {
        $gte: dateFrom,
        $lte: dateTo
      }}
    ]};*/
    var selector = {dateTime: {
        $gte: dateFrom,
        $lte: dateTo
      }};
  } else if (typeof searchString === 'string' && searchString.length) {
     var search = {$regex: `.*${searchString}.*`, $options: 'i'};
     selector = {$or: [
      {title: search},
      {group: search},
      {location: search},
      {modelNumber: search},
      {hours: search},
      {years: search},
      {serialNumber: search},
      {manufacturer: search},
      {status: search}
    ]};
       /*selector = {$and: [
       {status: false},
       {$or: [
       {title: search},
       {group: search},
       {location: search},
       {modelNumber: search},
       {hours: search},
       {years: search},
       {serialNumber: search},
       {manufacturer: search},
       {status: search}
     ]}
    ]};*/
    /*selector = {dateTime: {
      $gte: dateFrom,
      $lte: dateTo
    }};*/
    /*selector.title = {
      $regex: `.*${searchString}.*`,
      $options : 'i'
    };*/
  }

   Counts.publish(this, 'numberOfJobs', Jobs.find(selector), {
    noReady: true
  });

   return Jobs.find(selector, options);
 });
}