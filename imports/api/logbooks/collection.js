import { Mongo } from 'meteor/mongo';

export const Logbooks = new Mongo.Collection('logbooks');

Logbooks.allow({
 insert(userId, logbook) {
   return userId;
 },
 update(userId, logbook, fields, modifier) {
   return true;
 },
 remove(userId, logbook) {
   return true;
 }
});