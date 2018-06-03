import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('notes');

Notes.allow({
 insert(userId, note) {
   return userId;
 },
 update(userId, note, fields, modifier) {
   return true;
 },
 remove(userId, note) {
   return true;
 }
});