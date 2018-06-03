import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Watchkeeps } from '../../../api/watchkeeps';
import { Watchkeepers } from '../../../api/watchkeepers';
import { Taskgroups } from '../../../api/taskgroups';
import { Profiles } from '../../../api/profiles';
import { Taskgrouplists } from '../../../api/taskgrouplists';
import { Taskgroupscheds } from '../../../api/taskgroupscheds';
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './taskgroupdetails.html';
 
class Taskgroupdetails {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.taskgroupId = $stateParams.taskgroupId;
    console.info('stateparams', this.watchkeepId);
    $scope.userID = Meteor.userId();

    this.watchkeep = {};
    this.taskgroup = {};
    this.watchkeeper = {};
    this.doneby = {};
    this.watchDate = [];
    this.choices = [];
    this.selectedWatchkeep = {};
    this.grouplist = {};
    $scope.watchKeeper = {};
    $scope.doneBy = {};
    $scope.watchdate = {};
    $scope.unique = [];
    $scope.removeTaskUserID  = '';

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      task: 1
    };

    this.options = [
        {name: 'Yes', value: true},
        {name: 'No', value: false}
    ];

    $scope.passworD = '';
    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;
    $scope.notMatch = false;
    $scope.canDelete = false;

    this.subscribe('watchkeeps', () => [{}, 
      this.getReactively('searchText'),
    $scope.getReactively('userBoatID')
    ]);

    this.subscribe('taskgroups');

    this.subscribe('taskgroupscheds');

    this.subscribe('watchkeepers');

    this.subscribe('taskgrouplists');

    this.subscribe('profiles');

    this.subscribe('users');
 
    this.helpers({
        watchkeeps() {
            var selector = {taskgroupID: $stateParams.taskgroupId};
            var watchkeeps = Watchkeeps.find(selector, {
                sort : this.getReactively('sort')
            });
            console.info('docs', watchkeeps);
            return watchkeeps;
        },
        taskgroups() {
            return Taskgroups.findOne({
                _id: $stateParams.taskgroupId
            });
        },
        taskgroupscheds() {
          var selector = {taskgroupID: $stateParams.taskgroupId};
          return Taskgroups.find(selector);
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
        watchkeepers() {
            var selector = {taskgroupID: $stateParams.taskgroupId};
            return Taskgrouplists.find(selector);
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

    this.notification = function() {
      
      this.showNotif = false;
      console.info('notif daan', this.showNotif);
    }

    this.notification2 = function() {
      
      this.showNotif2 = false;
      console.info('notif daan', this.showNotif);
    }

    this.delete = function() {
      var jobId = $stateParams.jobId;
      var status = Jobs.remove(jobId);
      console.info('status removed', status);
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }

    this.removeJobConfirm = function(task) {
      //var status = Watchkeepers.remove(task._id);
      //console.info('remove status', status);
      console.info('watchkeepers to remove', task);
      $scope.removeTaskUserID = task.userID;
      var selector = {taskgroupID: task.taskgroupID};
      var watchkeeps = Watchkeeps.find(selector);
      watchkeeps.forEach(function(watchkeep){
        var selector = {$and: [
          {userID: $scope.removeTaskUserID},
          {watchkeepID: watchkeep._id}
        ]};
        var watchkeepers = Watchkeepers.find(selector);
        watchkeepers.forEach(function(watchkeeper){
          var status = Watchkeepers.remove(watchkeeper._id);
          console.info('status of removing watchkeeper', status);
        })
      });
      var selector = {$and: [
        {userID: task.userID},
        {taskgroupID: task.taskgroupID}
      ]};
      var taskgrouplists = Taskgrouplists.find(selector);
      taskgrouplists.forEach(function(taskgrouplist){
        var status = Taskgrouplists.remove(taskgrouplist._id);
        console.info('status of removing from taskgrouplist', status);
      });
      this.showNotif2 = true;
      $scope.removeTaskUserID = '';
    }

    this.removeJob = function() {
      console.info('userID', $scope.userID);
      var profiles = Profiles.find({
        userID: $scope.userID
      });

      console.info('profiles', profiles);
      profiles.forEach(function(profile){
        if(profile.userID == $scope.userID){
          console.info('pasok', profile.password);
          console.info('pass ko', $scope.passworD);
          if(profile.password == $scope.passworD){
            var selector = {watchkeepID: $scope.removeID};
            var watchkeeps = Watchkeepers.find(selector);
            var count = watchkeeps.count();
            console.info('watchkeepers found', count);
            watchkeeps.forEach(function(watchkeep){
              var removeID = watchkeep._id;
              Watchkeepers.remove(removeID);
              console.log('tangal');
            });
            Watchkeeps.remove($scope.removeID);
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('watchkeep', {}, {reload: 'watchkeep'});
          } else {
            $scope.notMatch = true;
            $scope.passworD = '';
          }
        } 
      });

    }

    this.viewWatchkeeper = function(watchkeeper) {
      console.info('you clicked', watchkeeper);
      this.selectedWatchkeep = watchkeeper;
    }

    this.submit = function() {
        this.watchkeep.owner = Meteor.userId();
        console.info('inventory', this.watchkeep);
        this.watchkeep.date = new Date();
        this.watchkeep.boatID = $scope.userBoatID;
        this.watchkeep.status = 'true';
        var taskgroupID = $stateParams.taskgroupId;
        var selector = {_id: taskgroupID};
        var taskgroup = Taskgroups.findOne(selector);
        console.info('taskgroup', taskgroup);
        this.watchkeep.taskGroup = taskgroup.name;
        this.watchkeep.taskgroupID = taskgroupID;
        var status = Watchkeeps.insert(this.watchkeep);
        console.info('status', status);
        this.watchkeep = {};
        //this.reset();
    }

    this.submitWatch = function() {
        console.info('this.doneby', this.doneby);
        console.info('submitted dates', this.watchDate);
        $scope.doneBy = this.doneby;
        $scope.watchdate = this.watchDate;
        $scope.watchKeeper = {};
        $scope.watchKeeper.name = $scope.doneBy.user.firstName + ' ' + $scope.doneBy.user.lastName;
        $scope.watchKeeper.userID = $scope.doneBy.user.userID;
        $scope.watchKeeper.boatID = $scope.doneBy.user.boatID;
        var taskgroupID = $stateParams.taskgroupId;
        var selector = {taskgroupID: taskgroupID};
        var tasks = Watchkeeps.find(selector);
        tasks.forEach(function(task){
            console.log('pasok dito sa task for');
            var selector = {$and: [
              {watchkeepID: task._id},
              {userID: $scope.watchKeeper.userID}
            ]};
            var watchkeepers = Watchkeepers.find(selector);
            watchkeepers.forEach(function(watchkeeper){
              var status = Watchkeepers.remove(watchkeeper._id);
              console.info('status for removing old watchkeeper task', status);
            });
            $scope.watchKeeper.watchkeepID = task._id;
            $scope.watchKeeper.taskGroup = task.taskGroup;
            $scope.watchKeeper.task = task.task;
            $scope.watchKeeper.withTime = task.withTime;
            if(task.withTime == 'true'){
                $scope.watchKeeper.time = task.time;
            }
            $scope.watchKeeper.dates = [];
            var length = $scope.watchdate.length;
            for(x=0;x<length;x++){
                $scope.watchdate[x].dateTime = parseInt($scope.watchdate[x].newdate.getTime());
            }
            for(x=0;x<length;x++){
                $scope.watchKeeper.dates[x] = $scope.watchdate[x];
            }
            $scope.watchKeeper.status = true;
            console.info('$scope.watchKeeper',$scope.watchKeeper);
            var status = Watchkeepers.insert($scope.watchKeeper);
            console.info('status', status);
        });

        var selector = {$and: [
            {userID: $scope.watchKeeper.userID},
            {taskgroupID: $stateParams.taskgroupId}
        ]};
        var taskgrouplists = Taskgrouplists.find(selector);
        var count = taskgrouplists.count();
        console.info('count from taskgrouplist', count);

        if(count == 0){
            this.grouplist.userID = $scope.watchKeeper.userID;
            this.grouplist.taskgroupID = $stateParams.taskgroupId;
            this.grouplist.name = $scope.watchKeeper.name;
            this.grouplist.dates = $scope.watchKeeper.dates;
            var status = Taskgrouplists.insert(this.grouplist);
            console.info('status', status);
        } else {
          taskgrouplists.forEach(function(taskgrouplist){
            Taskgrouplists.update({
              _id: taskgrouplist._id
            }, {
              $set: {
                userID: $scope.watchKeeper.userID,
                taskgroupID: $stateParams.taskgroupId,
                dates: $scope.watchKeeper.dates           
              }
            }, (error) => {
                if (error) {
                  console.log('Oops, unable to update the taskgroupsched...');
                } else {
                  console.log('Done!');
                  this.showNotif = true;
                }
            });
          });
        }
        
        this.watchkeeper = {};
        this.watchDate = [];
        this.doneby = {}; 
    }

    this.addDates = function() {
        var newItemNo = this.watchDate.length+1;
        this.watchDate.push({'id' : newItemNo, 'newdate' : '', 'dateTime' : ''});
    };

    this.removeKeeper = function(watchkeeper) {
        console.info('watchkeeper', watchkeeper);
        var userID = watchkeeper.userID;
    }

    this.removeTask = function(task) {
        console.info('task', task);
    }
}

}
 
const name = 'taskgroupdetails';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Taskgroupdetails]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('taskgroupdetails', {
        url: '/watchkeep/taskgroupdetails/:taskgroupId',
        template: '<taskgroupdetails></taskgroupdetails>',
    
        resolve: {
            currentUser($q, $state) {
                if (Meteor.userId() === null) {
                    return $q.reject('AUTH_REQUIRED');
                } else {
                  var userID = Meteor.userId();
                  var access = Meteor.users.findOne({_id: userID});
                  try{
                    if(access.watchkeeping){
                      return $q.resolve();
                    } else {
                      return $q.reject('LOGGED_IN');
                    }
                  } catch(err) {
                    return $q.reject('LOGGED_IN');
                  }
                };
            }
        },
        onEnter: ['$rootScope', '$stateParams', '$state', function ($rootScope, $stateParams, $state) {
          $rootScope.stateHolder = $stateParams.stateHolder;
      }]
      });
    }
]);

