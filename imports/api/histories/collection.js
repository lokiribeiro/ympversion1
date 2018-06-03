import { Mongo } from 'meteor/mongo';

export const Histories = new Mongo.Collection('histories');

Histories.allow({
 insert(userId, history) {
   return userId;
 },
 update(userId, history, fields, modifier) {
   return true;
 },
 remove(userId, history) {
   return true;
 }
});