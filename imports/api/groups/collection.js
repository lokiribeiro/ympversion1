import { Mongo } from 'meteor/mongo';

export const Groups = new Mongo.Collection('groups');

Groups.allow({
 insert(userId, group) {
   return userId;
 },
 update(userId, group, fields, modifier) {
   return true;
 },
 remove(userId, group) {
   return true;
 }
});