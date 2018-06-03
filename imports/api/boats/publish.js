import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Boats } from './collection';

if (Meteor.isServer) {
   Meteor.publish('boats', function(options, searchString) {
    var selector = {};

   if (typeof searchString === 'string' && searchString.length) {
    //selector.name = {
    //  $regex: `.*${searchString}.*`,
    //  $options : 'i'
    var search = {$regex: `.*${searchString}.*`, $options: 'i'};
    selector = {$or: [
      {boatName: search},
      {status: search}
    ]
    };
  }

  Counts.publish(this, 'numberOfBoats', Boats.find(selector), {
    noReady: true
  });

   return Boats.find(selector, options);
 });
}