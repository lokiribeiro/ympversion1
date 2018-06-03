import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

//import { Users } from '../../../api/users';
import { Profiles } from '../../../api/profiles';
import { Boats } from '../../../api/boats';
import template from './employees.html';
 
class Employees {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);
    this.details = '';

    this.cancreate = false;

    this.employee = {};
    $scope.profile = {};

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';
    this.showNotif = false;

    $scope.thisUser = Meteor.userId();
    console.info('userID', $scope.thisUser);

    this.types = [
      {name: 'Y1', value: 'Y1'},
      {name: 'Y2', value: 'Y2'},
      {name: 'Y3', value: 'Y3'},
      {name: 'Y4', value: 'Y4'}
    ];

    this.statuses = [
      {name: 'Available', value: 'Available'},
      {name: 'Employed', value: 'Employed'},
      {name: 'Onboard', value: 'Onboard'}
    ];

    this.mailings = [
      {name: 'Subscribed', value: 'Subscribed'},
      {name: 'Unsubscribed', value: 'Unsubscribed'}
    ];

    this.departments = [
      {name: 'Engine Department', value: 'Engine Department'},
      {name: 'Interior Department', value: 'Interior Department'},
      {name: 'Deck Department', value: 'Deck Department'},
      {name: 'Galley', value: 'Galley'},
      {name: 'Captain', value: 'Captain'}
    ];

    this.jobtitles = [
      {name: 'Captain', value: 'Captain'},
      {name: 'Chief Mate', value: 'Chief Mate'},
      {name: 'Mate', value: 'Mate'},
      {name: 'Chief Engineer', value: 'Chief Engineer'},
      {name: 'Engineer', value: 'Engineer'},
      {name: 'Chief Stewardess', value: 'Chief Stewardess'},
      {name: 'Stewardess', value: 'Stewardess'},
      {name: 'Bosun', value: 'Bosun'},
      {name: 'Deckhand', value: 'Deckhand'},
      {name: 'Chef', value: 'Chef'}
    ];

    this.terms = [
      {name: 'Permanent', value: 'Permanent'},
      {name: 'Rotation', value: 'Rotation'},
      {name: 'Relief', value: 'Relief'},
      {name: 'All', value: 'All'}
    ];

    this.roles = [
      {name: 'admin', value: 'admin'},
      {name: 'user', value: 'user'}
    ];



    this.subscribe('users');
    this.subscribe('boats');

    this.subscribe('profiles', () => [{
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);
 
    this.helpers({
      users() {
        return Meteor.users.find({});
      },
      profiles() {
        return Profiles.find({}, {
          sort : this.getReactively('sort')
        });
      },
      usersCount() {
        return Counts.get('numberOfUsers');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      boatuserID() {
        var boatUser = Meteor.users.find({
          _id: $scope.thisUser
        });
        console.info('boatUser', boatUser);
        boatUser.forEach(function(boat){
          $scope.boatID  = boat.boatID;
          console.info('boatID', boat);
        })
        console.info('boatID', $scope.boatID);
        return $scope.boatID;
      }
    });

    $scope.createProfile = function(details){
      console.info('employee details', $scope.profile)
      $scope.profile.userID = details;
      var boat = Meteor.user();
      console.info('boat', boat);
      var boatID = boat.boatID;
      var selector = {_id: boatID};
      var boats = Boats.find(selector);
      $scope.profile.boatName= '';
      boats.forEach(function(boat){
        if(boat._id == boatID){
          $scope.profile.boatName = boat.boatName;
        }
      })
      console.info('boatName', $scope.profile.boatName);
      $scope.profile.boatID = boatID;
      var jobs = true;
      Meteor.call('upsertNewRoleFromAdmin', details, $scope.profile.role, $scope.profile.department, $scope.profile.jobtitle, boatID, jobs, function(err, detail) {
        console.info('detail', detail);
          if (err) {
              console.info('err', err);
         } else {
           console.info('success', detail);
         }
      });
      var downloadurl = '../assets/img/user.jpg';
      Meteor.call('upsertPhotoUser', $scope.profile.userID, downloadurl, function(err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
       }
      });
      var status = Profiles.insert($scope.profile);
      console.info('status', status);
    }

    this.submit = function() {
      this.showNotif = false;
      this.employee.date = new Date();
      this.employee.password = 'Password123';
      this.employee.profilePhoto = '../assets/img/user.jpg';
      $scope.profile = this.employee;
      console.info('username', this.employee.username);
      Meteor.call('createUsers', this.employee.username, this.employee.password, this.employee.email, function(err, detail) {
          console.info('detail', detail);
            if (err) {
                console.info('err', err);
                this.showNotif = true;
           } else {
             this.userID = detail;
             console.info('success', this.userID);
             this.cancreate = true;
             console.info('cancreate', this.cancreate);
             $scope.createProfile(detail);
             this.employee = {};
           }
        });
    }

    this.notification = function() {
      
      this.showNotif = false;
      console.info('notif daan', this.showNotif);
    }

    this.logout = function() {
      window.loading_screen = pleaseWait({
        logo: "../assets/global/images/logo/logo-white2.png",
        backgroundColor: '#8c9093',
        loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
      });
      Accounts.logout();
      window.setTimeout(function(){
        window.loading_screen.finish();
        $state.go('login', {}, {reload: 'login'});
      },2000);
    }

    this.gotoDashboard = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
    this.gotoInventory = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('inventory', {}, {reload: 'inventory'});
    }
    this.gotoLogbook = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('logbook', {}, {reload: 'logbook'});
    }
    this.gotoEmployees = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('employees', {}, {reload: 'employees'});
    }
    this.gotoWatchkeep = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeep', {}, {reload: 'watchkeep'});
    }
    this.gotoSettings = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('settings', {}, {reload: 'settings'});
    }
    this.gotoAdminPanel = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminpanel', {}, {reload: 'adminpanel'});
    }
    this.gotoReports = function(equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('reports', {equipID: equipID}, {reload: 'reports'});
    }
  }

  isOwner(inventory) {
    return this.isLoggedIn && inventory.owner === this.currentUserId;
  }
   
  pageChanged(newPage) {
    this.page = newPage;
    console.info('new page', this.page);
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}
 
const name = 'employees';

//Employees.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Employees]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('employees', {
        url: '/employees',
        template: '<employees></employees>',
        resolve: {
          currentUser($q, $state) {
              if (Meteor.userId() === null) {
                  return $q.reject('AUTH_REQUIRED');
              } else {
                var userID = Meteor.userId();
                var access = Meteor.users.findOne({_id: userID});
                try{
                  if(access.employees){
                    return $q.resolve();
                  } else {
                    return $q.reject('LOGGED_IN');
                  }
                } catch(err) {
                  return $q.reject('LOGGED_IN');
                }
              };
          }
      }
      });
    }
]);