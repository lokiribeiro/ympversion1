import { Mongo } from 'meteor/mongo';

export const Watchkeeplogs = new Mongo.Collection('watchkeeplogs');

Watchkeeplogs.allow({
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