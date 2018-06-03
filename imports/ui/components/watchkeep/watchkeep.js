import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Watchkeeps } from '../../../api/watchkeeps';
import { Taskgroups } from '../../../api/taskgroups';
import { Taskgrouplists } from '../../../api/taskgrouplists';
import { Watchkeepers } from '../../../api/watchkeepers';
import { Watchkeeplogs } from '../../../api/watchkeeplogs';
import { Profiles } from '../../../api/profiles';
import { Notes } from '../../../api/notes';
import template from './watchkeep.html';
 
class Watchkeep {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.dateToday = new Date();
    this.dayToday = this.dateToday.getDay();
    $scope.dayToday2 = this.dateToday.getDay();
    this.hourToday = this.dateToday.getHours();
    console.info('hourToday', this.hourToday);
    this.dateTodayHours= this.dateToday.setHours(0,0,0,0);
    this.floatDate2 = parseInt(this.dateTodayHours);
    this.floatDate = this.dateTodayHours;
    $scope.todayDate = this.floatDate;
    console.info('this.floatDate', this.floatDate);

    this.watchkeep = {};
    this.taskgroup = {};
    this.logs = {};
    this.notes = {};
    $scope.swap = {};

    this.schedule = {};
    $scope.delWatchkeepID = '';
    $scope.delTaskgroupID = '';

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      task: 1
    };
    this.sort2 = {
        name: 1
    };
    this.sortTime = {
        time: 1
    };

    this.searchText = '';
    this.showNotif = false;
    this.showError = false;
    this.showNotesNotif = false;
    $scope.showSwap = false;
    this.watchkeeperID = '';

    this.options = [
      {name: 'Yes', value: true},
      {name: 'No', value: false}
    ];

    this.subscribe('watchkeeps', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText'),
    $scope.getReactively('userBoatID')
    ]);

    this.subscribe('users');
    this.subscribe('taskgroups');
    this.subscribe('taskgrouplists');
    this.subscribe('watchkeepers');
    this.subscribe('watchkeeplogs', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('dateFrom2'),
    this.getReactively('dateTo2'),
    this.getReactively('searchText'),
    $scope.getReactively('userBoatID')
    ]);
    this.subscribe('profiles');
 
    this.helpers({
      watchkeeps() {
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
        var watchkeeps =  Watchkeeps.find(selector, {
          sort : this.getReactively('sort')
        });
        console.info('watchkeeps', watchkeeps);
        return watchkeeps;
      },
      watchkeepsCount() {
        return Counts.get('numberOfWatchkeeps');
      },
      watchkeepers() {
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
        var watchkeepers =  Watchkeepers.find(selector, {
            sort: this.getReactively('sortTime')
        });
        console.info('watchkeepers', watchkeepers);
        return watchkeepers;
      },
      taskgroups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        if(boats){
            $scope.userBoatID = boats.boatID;
            var boatID = $scope.userBoatID;
            var selector = {boatID: boatID};
        } else {
            var selector = {};
        } 
        var taskgroups = Taskgroups.find(selector, {
            sort : this.getReactively('sort2')
        });
        console.info('docs', taskgroups);
        return taskgroups;
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
    this.gotoWatchkeepLog = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeeplog', {}, {reload: 'watchkeeplog'});
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

    this.submit = function() {
      this.watchkeep.owner = Meteor.userId();
      console.info('inventory', this.watchkeep);
      this.watchkeep.date = new Date();
      this.watchkeep.boatID = $scope.userBoatID;
      this.watchkeep.status = 'true';
      var taskgroupID = this.watchkeep.taskgroupID;
      var selector = {_id: taskgroupID};
      var taskgroup = Taskgroups.findOne(selector);
      console.info('taskgroup', taskgroup);
      this.watchkeep.taskGroup = taskgroup.name;
      var status = Watchkeeps.insert(this.watchkeep);
      console.info('status', status);
      this.watchkeep = {};
      //this.reset();
    }

    this.submitNotes = function() {
      this.showNotesNotif = false;
      console.info('notes', this.notes);
      this.notes.logDate = new Date();
      this.notes.timeSubmitted = new Date();
      this.notes.dateTime = this.notes.logDate.getTime();
      var dateHours = this.notes.logDate.setHours(0,0,0,0);
      console.info('dateHours', dateHours);
      this.notes.date = dateHours;
      this.notes.userID = Meteor.userId();
      console.info('userBoatID', $scope.userBoatID);
      this.notes.boatID = $scope.userBoatID;
      var status = Notes.insert(this.notes);
      console.info('status', status);
      this.notes = {};
      this.showNotesNotif = true;
    }

    this.submitTaskgroup = function() {
        this.taskgroup.owner = Meteor.userId();
        console.info('inventory', this.inventory);
        this.taskgroup.date = new Date();
        this.taskgroup.boatID = $scope.userBoatID;
        var status = Taskgroups.insert(this.taskgroup);
        console.info('status', status);
        this.taskgroup = {};
        //this.reset();
    }

    this.removeTaskGroup = function(taskgroup){
      console.info('taskgroup', taskgroup);
      var taskGroupID = taskgroup._id;

      var selector = {taskgroupID: taskGroupID};
      var watchkeeps = Watchkeeps.find(selector);
      watchkeeps.forEach(function(watchkeep){
        var selector = {watchkeepID: watchkeep._id};
        var watchkeepers = Watchkeepers.find(selector);
        watchkeepers.forEach(function(watchkeeper){
          var status = Watchkeepers.remove(watchkeeper._id);
          console.info('delete watchkeeper from tasks', status);
        })
        var status = Watchkeeps.remove(watchkeep._id);
        console.info('delete tasks from taskgroup', status);
      });

      var selector = {taskgroupID: taskGroupID};
      var taskgrouplists = Taskgrouplists.find(selector);
      taskgrouplists.forEach(function(taskgrouplist){
        var status = Taskgrouplists.remove(taskgrouplist._id);
        console.info('remove taskgrouplists', status);
      })

      var status = Taskgroups.remove(taskGroupID);
      console.info('remove taskgroup', status);
    }

    this.reset = function() {
      this.searchText = '';
      this.dateFrom2 = '';
      this.dateTo2 = '';
      
    }

    this.markTask = function(watchkeeper) {
        console.info('watchkeeper', watchkeeper);
        this.showNotif = true;
        this.logs.logDate = new Date();
        this.logs.dateTime = this.logs.logDate.getTime();
        var dateNow = new Date();
        this.logs.date = dateNow.setHours(0,0,0,0);
        console.info('this.logs.Date', this.logs.date);
        this.logs.name = watchkeeper.name;
        this.logs.boatID = watchkeeper.boatID;
        this.logs.userID = watchkeeper.userID;
        var task = watchkeeper.task;
        var taskGroup = watchkeeper.taskGroup;

        var selector = {$and: [
          {date: this.logs.date},
          {userID: this.logs.userID}
        ]};
        var watchkeeplog = Watchkeeplogs.find(selector);
        console.info('watchkeeplog', watchkeeplog);
        var count = watchkeeplog.count();
        console.info('count', count);
        var done = true;

        if(count == 0){
          var status = Watchkeeplogs.insert(this.logs);
          console.info('status', status);

          Meteor.call('upsertTasksLog', this.logs.userID, task, taskGroup, this.logs.logDate, this.logs.dateTime, this.logs.date, done, function(err, result) {
            if (err) {
              console.info('err', err);
            } else {
              console.info('uploaded', err);
            }
          });
        } else {
          Meteor.call('upsertTasksLog', this.logs.userID, task, taskGroup, this.logs.logDate, this.logs.dateTime, this.logs.date, done, function(err, result) {
            if (err) {
              console.info('err', err);
            } else {
              console.info('uploaded', err);
            }
          });
        }
        
        Watchkeepers.update({
            _id: watchkeeper._id
          }, {
            $set: {
              status: false
            }
          }, (error) => {
              if (error) {
                console.log('Oops, unable to update the job...');
              } else {
                console.log('Done!');
              }
          }); 
    }

    this.markTaskNotDone = function(watchkeeper) {
      console.info('watchkeeper', watchkeeper);
      this.showNotif = true;
      this.logs.logDate = new Date();
      this.logs.dateTime = this.logs.logDate.getTime();
      var dateNow = new Date();
      this.logs.date = dateNow.setHours(0,0,0,0);
      console.info('this.logs.Date', this.logs.date);
      this.logs.name = watchkeeper.name;
      this.logs.boatID = watchkeeper.boatID;
      this.logs.userID = watchkeeper.userID;
      var task = watchkeeper.task;
      var taskGroup = watchkeeper.taskGroup;

      var selector = {$and: [
        {date: this.logs.date},
        {userID: this.logs.userID}
      ]};
      var watchkeeplog = Watchkeeplogs.find(selector);
      console.info('watchkeeplog', watchkeeplog);
      var count = watchkeeplog.count();
      console.info('count', count);
      var done = false;

      if(count == 0){
        var status = Watchkeeplogs.insert(this.logs);
        console.info('status', status);

        Meteor.call('upsertTasksLog', this.logs.userID, task, taskGroup, this.logs.logDate, this.logs.dateTime, this.logs.date, done, function(err, result) {
          if (err) {
            console.info('err', err);
          } else {
            console.info('uploaded', err);
          }
        });
      } else {
        Meteor.call('upsertTasksLog', this.logs.userID, task, taskGroup, this.logs.logDate, this.logs.dateTime, this.logs.date, done, function(err, result) {
          if (err) {
            console.info('err', err);
          } else {
            console.info('uploaded', err);
          }
        });
      }
      
      Watchkeepers.update({
          _id: watchkeeper._id
        }, {
          $set: {
            status: false
          }
        }, (error) => {
            if (error) {
              console.log('Oops, unable to update the job...');
            } else {
              console.log('Done!');
            }
        }); 
  }

    this.notification = function() {
        this.showNotif = false;
        this.showError = false;
        $scope.showSwap = false;
        this.showNotesNotif = false;
    }

    this.swapSchedule = function() {
      console.info('this.schedule', this.schedule);
      this.showError = false;
      var userID = this.schedule.userID;
      $scope.scheduleUserID = this.schedule.userID;
      $scope.scheduleName = this.schedule.firstName + ' ' + this.schedule.lastName;
      var boatID = this.schedule.boatID;
      var selector = {_id: userID};
      var user = Meteor.users.findOne(selector);
      $scope.myId = Meteor.userId();
      console.info('myId', $scope.myId);
      console.info('user details', user);
      if(user.watchkeeper){
        selector = {userID: $scope.myId};
        var watchkeepers = Watchkeepers.find(selector);
        watchkeepers.forEach(function(watchkeeper){
          var totalDates = watchkeeper.dates.length;
          console.info('totalDates', totalDates);
          console.info('watchkeeper', watchkeeper);
          for(x=0;x<totalDates;x++){
            if(watchkeeper.dates[x].dateTime == $scope.todayDate){
              $scope.swap = {};
              console.info('pasok dito', watchkeeper.dates[x]);
              var newDate = watchkeeper.dates[x].newDate;
              var dateTime = watchkeeper.dates[x].dateTime;
              var ID = watchkeeper.dates[x].id;
              var watchkeeperID = watchkeeper._id;
              var newUserID = $scope.scheduleUserID;

              $scope.dateTime = watchkeeper.dates[x].dateTime;
              $scope.newDate = watchkeeper.dates[x].newDate;
          
              $scope.swap.name = $scope.scheduleName;
              $scope.swap.userID = $scope.scheduleUserID;
              $scope.swap.boatID = watchkeeper.boatID;
              $scope.swap.watchkeepID = watchkeeper.watchkeepID;
              $scope.swap.taskGroup = watchkeeper.taskGroup;
              $scope.swap.task = watchkeeper.task;

              if(watchkeeper.withTime == 'true') {
                $scope.swap.time = watchkeeper.time;
              }
              $scope.swap.withTime = watchkeeper.withTime;
              $scope.swap.dates = [];
              $scope.swap.dates.push({'id' : '', 'newdate' : watchkeeper.dates[x].newdate, 'dateTime' : watchkeeper.dates[x].dateTime});
              $scope.swap.status = true;
              console.info('useridschedule', $scope.scheduleUserID);
              console.info('watchkeepID', $scope.swap.watchkeepID);
              var selector = {$and: [
                {userID: $scope.scheduleUserID},
                {watchkeepID: $scope.swap.watchkeepID}
              ]};
              var countScheds = Watchkeepers.find(selector);
              console.info('countScheds', countScheds);
              var count = countScheds.count();
              console.info('count', count);
              if(count){
                countScheds.forEach(function(countSched){
                  var watchkeeperID = countSched._id;
                  var lengthArray = countSched.dates.length;
                  console.info('lengthArray', lengthArray);
                  for(x=0;x<lengthArray;x++){
                    if(countSched.dates[x].dateTime == $scope.dateTime){
                      console.info('task already exists on that time', countSched.dates[x].dateTime);
                    } else {
                      Meteor.call('pushSchedule', watchkeeperID, $scope.swap.userID, $scope.swap.name, $scope.dateTime, $scope.newDate, function(err, result) {
                        if (err) {
                          console.info('err push sched', err);
                        } else {
                          console.info('uploaded push sched', err);
                        }
                       });
                      }
                    }
                });
              } else {
                var status = Watchkeepers.insert($scope.swap);
                console.info('status of swap', status);
              }
              console.info('totalDates', totalDates);
              if(totalDates == 1) {
                var status = Watchkeepers.remove(watchkeeperID);
                console.info('status of remove from watchkeeper', status);
              } else {
                Meteor.call('pullSchedule', watchkeeperID, newUserID, $scope.scheduleName, dateTime, newDate, ID, function(err, result) {
                  if (err) {
                    console.info('err pull sched', err);
                  } else {
                    console.info('uploaded pull sched', err);
                  }
                });                  
              }
            }
          }
            $scope.showSwap = true;
        });
      } else {
        this.showError = true;
      }
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
 
const name = 'watchkeep';

//Inventory.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Watchkeep]
})
.config(['$stateProvider',
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('watchkeep', {
      url: '/watchkeep',
      template: '<watchkeep></watchkeep>',
      resolve: {
        currentUser($q, $state) {
            if (Meteor.userId() === null) {
                return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            };
        }
    }
    });
  }
]);

