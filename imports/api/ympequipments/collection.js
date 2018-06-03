import { Mongo } from 'meteor/mongo';

export const Ympequipments = new Mongo.Collection('ympequipments');

Ympequipments.allow({
 insert(userId, ympequipment) {
   return userId;
 },
 update(userId, ympequipment, fields, modifier) {
   //return userId && inventory.owner === userId;
   return true;
 },
 remove(userId, ympequipment) {
   //return userId && inventory.owner === userId;
   return true
 }
});