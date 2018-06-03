import { Mongo } from 'meteor/mongo';

export const Taskgroups = new Mongo.Collection('taskgroups');

Taskgroups.allow({
 insert(userId, taskgroup) {
   return userId;
 },
 update(userId, taskgroup, fields, modifier) {
   return true;
 },
 remove(userId, taskgroup) {
   return true;
 }
});