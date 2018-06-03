import { Mongo } from 'meteor/mongo';

export const Subgroups = new Mongo.Collection('subgroups');

Subgroups.allow({
 insert(userId, subgroup) {
   return userId;
 },
 update(userId, subgroup, fields, modifier) {
   return true;
 },
 remove(userId, subgroup) {
   return true;
 }
});