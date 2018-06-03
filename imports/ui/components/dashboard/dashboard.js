import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Jobs } from '../../../api/jobs';
import { Parties } from '../../../api/parties';
import { Groups } from '../../../api/groups';
import template from './dashboard.html';
 
class Dashboard {
  constructor($scope, $reactive, $state) {
    //'ngInject';
    angular.element(document).ready(function () {
      var jobs =  Jobs.find({});
      console.info('jobs on load', jobs);
      var compareDate = new Date();
      $scope.compareDate = compareDate.getTime();
      console.info('$scope.compareDate', $scope.compareDate);

      
      jobs.forEach(function(job){
        if(job.dateTime <= $scope.compareDate){
          if(job.repeating){
            if(job.hours){
              job.dateNext = job.dateTime + (job.hours*60*60*1000);
              var newDate = job.dateNext;
              job.date = new Date(newDate);
              job.dateTime = job.date.getTime();
              var jobID = job._id;
              var date = job.date;
              var dateTime = job.dateTime;
              var dateNext = job.dateNext;

              Meteor.call('upsertNewJobTime', jobID, date, dateTime, dateNext, function(err, result) {
                console.log('success: ' + job.dateTime);
                if (err) {
                  console.info('err', err);
                } else {
                  console.info('uploaded', err);
               }
             });

            } else if(job.days){
              var hours = job.days * 24;
              job.dateNext = job.dateTime + (hours*60*60*1000);
              var newDate = job.dateNext;
              job.date = new Date(newDate);
              job.dateTime = job.date.getTime();
              var jobID = job._id;
              var date = job.date;
              var dateTime = job.dateTime;
              var dateNext = job.dateNext;

              Meteor.call('upsertNewJobTime', jobID, date, dateTime, dateNext, function(err, result) {
                console.log('success: ' + job.dateTime);
                if (err) {
                  console.info('err', err);
                } else {
                  console.info('uploaded', err);
               }
             });
            }
          }
        }
      });

    });
 
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

    this.subscribe('parties', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('jobs', () => [{
      sort: this.getReactively('sortDate')
    }, this.getReactively('searchText'), 
    this.getReactively('dateFrom2'),
    this.getReactively('dateTo2')
    ]);

    this.subscribe('users');

    this.subscribe('groups');
 
    this.helpers({
      parties() {
        var parties =  Parties.find({}, {
          sort : this.getReactively('sort')
        });
        console.info('parties', parties);
        return parties;
      },
      jobs() {
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
        var jobs =  Jobs.find(selector, {
          sort : this.getReactively('sortDate')
        });
        console.info('parties', jobs);
        return jobs;
      },
      jobsCount() {
        return Counts.get('numberOfJobs');
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
      groups() {
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
        return Groups.find(selector, {
          sort : this.getReactively('sort')
        });
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
 
const name = 'dashboard';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Dashboard]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      template: '<dashboard></dashboard>',
      resolve: {
        currentUser($q, $state) {
            if (!Meteor.userId()) {
                return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            };
        }
      }
    });
  } 
]);

