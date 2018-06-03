import _ from 'underscore';
import { Jobs } from '../imports/api/jobs';

import { Meteor } from 'meteor/meteor';

export function  upsertNewJobTime(jobID, date, dateTime, dateNext){
    var selector = {_id: jobID};
    var modifier = {$set: {
        date: date,
        dateTime: dateTime,
        dateNext: dateNext,
        status: false
      }};
      if (Meteor.isServer) {
    var timeUpsert = Jobs.upsert(selector, modifier);
      }
    return timeUpsert;
}
    
Meteor.methods({
    upsertNewJobTime
});