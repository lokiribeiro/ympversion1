import { Mongo } from 'meteor/mongo';

export const Watchkeepers = new Mongo.Collection('watchkeepers');

Watchkeepers.allow({
 insert(userId, watchkeeper) {
   return userId;
 },
 update(userId, watchkeeper, fields, modifier) {
   return true;
 },
 remove(userId, watchkeeper) {
   return true;
 }
});