import _ from 'underscore';
import { Watchkeepers } from '../imports/api/watchkeepers';

import { Meteor } from 'meteor/meteor';

export function  pullSchedule(watchkeeperID, newUserID, scheduleName, dateTime, newDate, ID){
  var selector = {_id: watchkeeperID};
  var modifier = {$pull: { 
    dates: {
      dateTime: dateTime
    }
  }};
  if (Meteor.isServer) {
        var watchUpsert = Watchkeepers.update(selector, modifier);
  }
  return watchUpsert;
}

export function  pushSchedule(watchkeeperID, newUserID, scheduleName, dateTime, newDate){
  var selector = {_id: watchkeeperID};
  var ID = '';
  var modifier = {$push: { 
    dates : {
      id: ID,
      newdate: newDate,
      dateTime: dateTime
    }
  }};
  if (Meteor.isServer) {
        var watchUpsert = Watchkeepers.update(selector, modifier);
  }
  return watchUpsert;
}

export function upsertWatchkeepDay(userID, watchkeepID, dateTime, newDate){
  var status = false;
  var idNow = 'Completed';
  var selector = {$and: [
      {watchkeepID: watchkeepID},
      {userID: userID},
      {"dates.dateTime": dateTime}
    ]};
  var modifier = {$set: {
    "dates.$": {
      id: idNow,
      newdate: newDate,
      dateTime: dateTime,
      status: status
    }
  }}
  var userUpsert =  Watchkeepers.update(selector, modifier);
  return userUpsert;
}
  
  

Meteor.methods({
  pullSchedule,
  pushSchedule,
  upsertWatchkeepDay
});