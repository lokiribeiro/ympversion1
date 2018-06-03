import _ from 'underscore';
import { Profiles } from '../imports/api/profiles';

import { Meteor } from 'meteor/meteor';
  
export function  upsertProfilePhoto(profileID, downloadUrl){
  var selector = {_id: profileID};
  var modifier = {$set: {
      profilePhoto: downloadUrl
    }};
    if (Meteor.isServer) {
  var fileUpsert = Profiles.upsert(selector, modifier);
    }
  return fileUpsert;
}

export function upsertBoatIDProfile(userID, boatID){
  var selector = {_id: userID};
  var modifier = {$set: {
    boatID: boatID
  }};
  var roleUpsert = Profiles.upsert(selector, modifier);
  return roleUpsert;
}
  

Meteor.methods({
    upsertProfilePhoto,
    upsertBoatIDProfile
});