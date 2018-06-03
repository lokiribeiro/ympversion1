import { Mongo } from 'meteor/mongo';

export const Boats = new Mongo.Collection('boats');

Boats.allow({
 insert() {
   return true;
 },
 update(userId, boat, fields, modifier) {
   //return userId && inventory.owner === userId;
   return true;
 },
 remove(userId, boat) {
   //return userId && inventory.owner === userId;
   return true
 }
});