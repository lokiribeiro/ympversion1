import _ from 'underscore';
import '../imports/api/users';

import { Meteor } from 'meteor/meteor';


   
   export function createUsers(username, password, email) {
    
     if (!this.userId) {
       throw new Meteor.Error(400, 'You have to be logged in!');
     }

     if (Meteor.isServer) {
        username = Accounts.createUser({username:username, password:password});
     }
     return username;
   }

   export function upsertNewRoleFromRegister(userID, userRole, boatID, jobs, logbook, inventory, employees, superadmin){
    var selector = {_id: userID};
    var modifier = {$set: {
      role: userRole,
      boatID: boatID,
      jobs: jobs,
      logbook: logbook,
      inventory: inventory,
      employees: employees,
      superadmin: superadmin
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertNewRoleFromAdmin(userID, userRole, department, jobtitle, boatID, jobs, boatName){
    var selector = {_id: userID};
    var modifier = {$set: {
      role: userRole,
      department: department,
      jobtitle: jobtitle,
      boatID: boatID,
      jobs: jobs,
      boatName: boatName
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertJobsAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      jobs: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertInventoryAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      inventory: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertLogbookAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      logbook: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertEmployeesAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      employees: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertSettingsAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      settings: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertWatchkeepingAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      watchkeeping: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertWatchkeeperAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      watchkeeper: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertSupplierAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      supplier: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function  upsertPhotoUser(profileID, downloadUrl){
    var selector = {_id: profileID};
    var modifier = {$set: {
        profilePhoto: downloadUrl
      }};
      if (Meteor.isServer) {
    var fileUpsert = Meteor.users.upsert(selector, modifier);
      }
    return fileUpsert;
  }

  export function changePasswordNow(userId, password) {
    
     if (!this.userId) {
       throw new Meteor.Error(400, 'You have to be logged in!');
     }

     if (Meteor.isServer) {
       var options = {logout : false};
        password = Accounts.setPassword(userId, password, options);
     }
     return password;
   }

  export function createUsersFromRegister(password, username) { 
    if (Meteor.isServer) {
      username = Accounts.createUser({username:username, password:password});
    }
    return username;
  }

  export function upsertBoatID(userID, boatID, boatName){
    var selector = {_id: userID};
    var modifier = {$set: {
      boatID: boatID,
      boatName: boatName
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertDeptTitle(userID, department, jobtitle, role){
    var selector = {_id: userID};
    var modifier = {$set: {
      department: department,
      jobtitle: jobtitle,
      role: role
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertReportsAccess(userID, access){
    var selector = {_id: userID};
    var modifier = {$set: {
      reports: access
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertSetRemove(userID, forRemove){
    var selector = {_id: userID};
    var setToFalse = false;
    var modifier = {$set: {
      forRemove: forRemove,
      jobs: setToFalse,
      inventory: setToFalse,
      logbook: setToFalse,
      employees: setToFalse,
      equipments: setToFalse,
      watchkeeping: setToFalse,
      watchkeeper: setToFalse,
      reports: setToFalse,
      supplier: setToFalse
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertRemoveUser(userID, status){
    var selector = {_id: userID};
    var boatID = '';
    var boatName = '';
    var role = 'user';
    var modifier = {$set: {
      status: status,
      boatID: boatID,
      boatName: boatName,
      role: role
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertDeclineRemove(userID, setRemove, decline){
    var selector = {_id: userID};
    var modifier = {$set: {
      forRemove: setRemove,
      decline: decline
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }

  export function upsertOnboardUser(userID, boatID, boatName){
    var selector = {_id: userID};
    var status = true;
    var forRemove = false;
    var jobs = true;
    var modifier = {$set: {
      status: status,
      boatID: boatID,
      boatName: boatName,
      forRemove: forRemove,
      jobs: jobs
    }};
    var roleUpsert = Meteor.users.upsert(selector, modifier);
    return roleUpsert;
  }



   Meteor.methods({
       createUsers,
       upsertNewRoleFromRegister,
       upsertNewRoleFromAdmin,
       upsertJobsAccess,
       upsertInventoryAccess,
       upsertLogbookAccess,
       upsertEmployeesAccess,
       upsertWatchkeepingAccess,
       upsertWatchkeeperAccess,
       upsertSettingsAccess,
       upsertPhotoUser,
       changePasswordNow,
       createUsersFromRegister,
       upsertBoatID,
       upsertDeptTitle,
       upsertReportsAccess,
       upsertSupplierAccess,
       upsertSetRemove,
       upsertRemoveUser,
       upsertDeclineRemove,
       upsertOnboardUser
   });