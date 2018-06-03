import { Mongo } from 'meteor/mongo';

export const Watchkeeps = new Mongo.Collection('watchkeeps');

Watchkeeps.allow({
 insert(userId, watchkeep) {
   return userId;
 },
 update(userId, watchkeep, fields, modifier) {
   return true;
 },
 remove(userId, watchkeep) {
   return true;
 }
});