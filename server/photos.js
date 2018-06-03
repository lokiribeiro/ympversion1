import _ from 'underscore';
import { Photos } from '../imports/api/photos';

import { Meteor } from 'meteor/meteor';
  
export function  upsertPhotos(profileID, downloadUrl, jobID){
    var photos = {};
    photos.userID = profileID;
    photos.downloadurl = downloadUrl;
    photos.jobID = jobID;
   
      if (Meteor.isServer) {
    var fileUpsert = Photos.insert(photos);
      }
    return fileUpsert;
}


Meteor.methods({
  upsertPhotos
});