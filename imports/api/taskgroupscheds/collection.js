import { Mongo } from 'meteor/mongo';

export const Taskgroupscheds = new Mongo.Collection('taskgroupscheds');

Taskgroupscheds.allow({
 insert(userId, taskgroupsched) {
   return userId;
 },
 update(userId, taskgroupsched, fields, modifier) {
   return true;
 },
 remove(userId, taskgroupsched) {
   return true;
 }
});