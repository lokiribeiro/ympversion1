import { Mongo } from 'meteor/mongo';

export const Users = new Mongo.Collection('users');

Users.allow({
 insert() {
   return true;
 },
 update(userId, inventory, fields, modifier) {
   return true;
 },
 remove(userId, inventory) {
   return true;
 }
});