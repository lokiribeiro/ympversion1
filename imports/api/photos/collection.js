import { Mongo } from 'meteor/mongo';

export const Photos = new Mongo.Collection('photos');

Photos.allow({
 insert(userId, photo) {
   return userId;
 },
 update(userId, photo, fields, modifier) {
   return true;
 },
 remove(userId, photo) {
   return true;
 }
});