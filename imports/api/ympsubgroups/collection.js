import { Mongo } from 'meteor/mongo';

export const Ympsubgroups = new Mongo.Collection('ympsubgroups');

Ympsubgroups.allow({
 insert(userId, ympsubgroup) {
   return userId;
 },
 update(userId, ympsubgroup, fields, modifier) {
   return true;
 },
 remove(userId, ympsubgroup) {
   return true;
 }
});