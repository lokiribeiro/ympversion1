import { Mongo } from 'meteor/mongo';

export const Supports = new Mongo.Collection('supports');

Supports.allow({
 insert(userId, support) {
   return userId;
 },
 update(userId, support, fields, modifier) {
   return true;
 },
 remove(userId, support) {
   return true;
 }
});