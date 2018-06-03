import _ from 'underscore';
import { Watchkeeplogs } from '../imports/api/watchkeeplogs';

import { Meteor } from 'meteor/meteor';

export function upsertTasksLog(userID, task, taskGroup, logDate, dateTime, date, done){
    var selector = {$and: [
        {date: date},
        {userID: userID}
      ]};
    var modifier = {$push: {tasks: {task: task, taskGroup: taskGroup, logDate: logDate, dateTime: dateTime, date: date, done: done  }}}
    var userUpsert =  Watchkeeplogs.update(selector, modifier);
    return userUpsert;
}
  

Meteor.methods({
    upsertTasksLog
});