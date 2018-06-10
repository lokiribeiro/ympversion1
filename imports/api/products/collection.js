import { Mongo } from 'meteor/mongo';

export const Products = new Mongo.Collection('products');

Products.allow({
 insert(userId, product) {
   return userId;
 },
 update(userId, product, fields, modifier) {
   //return userId && inventory.owner === userId;
   return true;
 },
 remove(userId, product) {
   //return userId && inventory.owner === userId;
   return true
 }
});