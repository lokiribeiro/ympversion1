import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Ympjobs } from './collection';

if (Meteor.isServer) {
    Meteor.publish('ympjobs', function(options, searchString) {
        var selector = {};
    
       if (typeof searchString === 'string' && searchString.length) {
        
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
      }
    
       Counts.publish(this, 'numberOfYmpJobs', Ympjobs.find(selector), {
        noReady: true
      });
     
        return Ympjobs.find(selector, options);
      });
}