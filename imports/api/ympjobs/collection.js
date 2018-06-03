import { Mongo } from 'meteor/mongo';

export const Ympjobs = new Mongo.Collection('ympjobs');

Ympjobs.allow({
 insert(userId, ympjob) {
   return userId;
 },
 update(userId, ympjob, fields, modifier) {
   return true;
 },
 remove(userId, ympjob) {
   return true;
 }
});