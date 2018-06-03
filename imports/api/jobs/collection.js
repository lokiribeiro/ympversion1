import { Mongo } from 'meteor/mongo';

export const Jobs = new Mongo.Collection('jobs');

Jobs.allow({
 insert(userId, job) {
   return userId;
 },
 update(userId, job, fields, modifier) {
   return true;
 },
 remove(userId, job) {
   return true;
 }
});