import { Mongo } from 'meteor/mongo';

export const Taskgrouplists = new Mongo.Collection('taskgrouplists');

Taskgrouplists.allow({
 insert(userId, taskgrouplist) {
   return userId;
 },
 update(userId, taskgrouplist, fields, modifier) {
   return true;
 },
 remove(userId, taskgrouplist) {
   return true;
 }
});