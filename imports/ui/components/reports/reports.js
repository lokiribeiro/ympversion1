import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Jobs } from '../../../api/jobs';

import { Histories } from '../../../api/histories';
import { Profiles } from '../../../api/profiles';
import template from './reports.html';
 
class Reports {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.job = {};
    this.dateFrom = '';
    this.dateTo = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.sortDate = {
      date: -1
    };
    this.searchText = '';
    this.viewJobs = true;

    this.choices = [
      {name: 'Yes', value: true},
      {name: 'No', value: false},
    ];

    this.choices2 = [
      {name: 'Yes', value: false},
      {name: 'No', value: true},
    ];

    this.subscribe('reportshistory', () => [{
      sort: this.getReactively('sortDate')
    }, this.getReactively('searchText'),
    this.getReactively('dateFrom2'),
    this.getReactively('dateTo2')
    ]);

    this.subscribe('profiles');

    this.subscribe('users');
 
    this.helpers({
      reportlists() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        }     
        var histories =  Histories.find(selector, {
          sort : this.getReactively('sortDate')
        });
        console.info('histories reports', histories);
        return histories;
      },
      profiles() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if(boats){
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = {boatID: boatID};
        } else {
          var selector = {};
        } 
        return Profiles.find(selector);
      },
      historyCount() {
        return Counts.get('numberOfReportsHistory');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      }
    });

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

    this.viewFilter = function() {
      this.viewJobs = !this.viewJobs;
      console.info('viewJobs', this.viewJobs);
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
    this.gotoEquipments = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipments', {}, {reload: 'equipments'});
    }
    this.gotoWatchkeep = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeep', {}, {reload: 'watchkeep'});
    }
    this.gotoAdminPanel = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminpanel', {}, {reload: 'adminpanel'});
    }

    this.gotoEquipList = function(equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipmentlist', {equipID: equipID}, {reload: 'equipmentlist'});
    }

    this.gotoReports = function(equipID) {
        angular.element("body").removeClass("modal-open");
        var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
        removeMe.remove();
        $state.go('reports', {equipID: equipID}, {reload: 'reports'});
    }

    this.gotoLogbookReports = function(equipID) {
        angular.element("body").removeClass("modal-open");
        var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
        removeMe.remove();
        $state.go('logbookreports', {equipID: equipID}, {reload: 'logbookreports'});
    }

    this.submit = function() {
      this.job.owner = Meteor.userId();
      this.job.date = new Date();
      this.job.dateTime = this.job.date.getTime();
      this.job.boatID = $scope.userBoatID;
      var user = Meteor.user();
      console.info('user with department', user);
      if(user.department) {
        this.job.department = user.department;
      } 
      if(this.job.hours){
        console.log('no lastservice date with hours');
        this.job.dateNext = this.job.dateTime + (this.job.hours*60*60*1000);
        var newDate = this.job.dateNext;
        this.job.date = new Date(newDate);
        this.job.dateTime = this.job.date.getTime();
        this.job.status = false;
      } else if(this.job.days){
        console.log('no lastservice date with days');
        var hours = this.job.days * 24;
        this.job.dateNext = this.job.dateTime + (hours*60*60*1000);
        var newDate = this.job.dateNext;
        this.job.date = new Date(newDate);
        this.job.dateTime = this.job.date.getTime();
        this.job.status = false;
      }
      this.job.unplanned = false;
      var user = Meteor.user();
      console.info('user for dept', user);
      this.job.department = user.department;
      console.info('this.job', this.job);
      var status = Jobs.insert(this.job);
      this.job = {};
    }

    this.submitUnplanned = function() {
      this.job.owner = Meteor.userId();
      this.job.date = new Date();
      this.job.dateTime = this.job.date.getTime();
      this.job.title = 'Unplanned Job';
      this.job.unplanned = true;
      this.job.status = false;
      this.job.boatID = $scope.userBoatID;
      var user = Meteor.user();
      console.info('user for dept', user);
      this.job.department = user.department;
      console.info('this.job', this.job);
      var status = Jobs.insert(this.job);
      this.job = {};
    }
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }
   
  pageChanged(newPage) {
    this.page = newPage;
    console.info('new page', this.page);
  }

  sortChanged(sort) {
    this.sort = sort;
  }

  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';
    
  }

  resetForm() {
    this.job = {};
  }

  filterNow() {
    console.info('searchText', this.searchText);
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
  }
}
 
const name = 'reports';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Reports]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('reports', {
      url: '/reports',
      template: '<reports></reports>',
      resolve: {
        currentUser($q, $state) {
            if (!Meteor.userId()) {
                return $q.reject('AUTH_REQUIRED');
            } else {
              var userID = Meteor.userId();
              var access = Meteor.users.findOne({_id: userID});
              try{
                if(access.reports){
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

