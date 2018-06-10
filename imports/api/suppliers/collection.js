import { Mongo } from 'meteor/mongo';

export const Suppliers = new Mongo.Collection('suppliers');

Suppliers.allow({
 insert(userId, supplier) {
   return userId;
 },
 update(userId, supplier, fields, modifier) {
   //return userId && inventory.owner === userId;
   return true;
 },
 remove(userId, supplier) {
   //return userId && inventory.owner === userId;
   return true;
 }
});