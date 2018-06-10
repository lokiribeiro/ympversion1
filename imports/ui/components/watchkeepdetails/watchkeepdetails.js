import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Watchkeeps } from '../../../api/watchkeeps';
import { Watchkeepers } from '../../../api/watchkeepers';
import { Taskgroups } from '../../../api/taskgroups';
import { Taskgrouplists } from '../../../api/taskgrouplists';
import { Profiles } from '../../../api/profiles';
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './watchkeepdetails.html';

class Watchkeepdetails {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
    //'ngInject';

    $reactive(this).attach($scope);

    this.watchkeepId = $stateParams.watchkeepId;
    console.info('stateparams', this.watchkeepId);
    $scope.userID = Meteor.userId();

    this.watchkeep = {};
    this.taskgroup = {};
    this.watchkeeper = {};
    this.doneby = {};
    this.watchDate = [];
    this.choices = [];
    this.selectedWatchkeep = {};

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.options = [
      { name: 'Active', value: true },
      { name: 'Inactive', value: false }
    ];

    $scope.passworD = '';
    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;
    $scope.notMatch = false;
    $scope.canDelete = false;
    this.grouplist = {};

    this.subscribe('watchkeeps', () => [{},
    this.getReactively('searchText'),
    $scope.getReactively('userBoatID')
    ]);

    this.subscribe('taskgroups');

    this.subscribe('taskgrouplists');

    this.subscribe('watchkeepers');

    this.subscribe('profiles');

    this.subscribe('users');

    this.helpers({
      watchkeep() {
        return Watchkeeps.findOne({
          _id: $stateParams.watchkeepId
        });
      },
      taskgroups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        if (boats) {
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = { boatID: boatID };
        } else {
          var selector = {};
        }
        var taskgroups = Taskgroups.find(selector, {
          sort: this.getReactively('sort2')
        });
        console.info('docs', taskgroups);
        return taskgroups;
      },
      profiles() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if (boats) {
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = { boatID: boatID };
        } else {
          var selector = {};
        }
        return Profiles.find(selector);
      },
      watchkeepers() {
        var selector = { watchkeepID: $stateParams.watchkeepId };
        return Watchkeepers.find(selector);
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

    this.logout = function () {
      window.loading_screen = pleaseWait({
        logo: "../assets/global/images/logo/logo-white2.png",
        backgroundColor: '#8c9093',
        loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
      });
      Accounts.logout();
      window.setTimeout(function () {
        window.loading_screen.finish();
        $state.go('login', {}, { reload: 'login' });
      }, 2000);
    }

    this.gotoDashboard = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('dashboard', {}, { reload: 'dashboard' });
    }
    this.gotoInventory = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('inventory', {}, { reload: 'inventory' });
    }
    this.gotoLogbook = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('logbook', {}, { reload: 'logbook' });
    }
    this.gotoEmployees = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('employees', {}, { reload: 'employees' });
    }
    this.gotoWatchkeep = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeep', {}, { reload: 'watchkeep' });
    }
    this.gotoSettings = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('settings', {}, { reload: 'settings' });
    }
    this.gotoAdminPanel = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminpanel', {}, { reload: 'adminpanel' });
    }
    this.gotoReports = function (equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('reports', { equipID: equipID }, { reload: 'reports' });
    }
    this.gotoSupplier = function (equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('supplier', { equipID: equipID }, { reload: 'supplier' });
    }


    this.notification = function () {

      this.showNotif = false;
      console.info('notif daan', this.showNotif);
    }

    this.notification2 = function () {

      this.showNotif2 = false;
      console.info('notif daan', this.showNotif);
    }

    this.resetValue = function () {
      $scope.uploadSuccess = false;
    }

    this.notCompleted = function () {

      this.notComplete = false;
      console.info('complete daan', this.notComplete);
    }

    this.addDates = function () {
      var newItemNo = this.watchDate.length + 1;
      this.watchDate.push({ 'id': newItemNo, 'newdate': '', 'dateTime': '' });
    };

    this.addDates2 = function () {
      var newItemNo = this.selectedWatchkeep.dates.length + 1;
      this.selectedWatchkeep.dates.push({ 'id': newItemNo, 'newdate': '', 'dateTime': '' });
    };

    this.delete = function () {
      var jobId = $stateParams.jobId;
      var status = Jobs.remove(jobId);
      console.info('status removed', status);
      $state.go('dashboard', {}, { reload: 'dashboard' });
    }

    this.removeJobConfirm = function (task) {
      var selector = { _id: task.watchkeepID };
      var watchkeeps = Watchkeeps.findOne(selector);
      var userID = task.userID;
      console.info('watchkeeps for removal', watchkeeps);
      if (watchkeeps) {
        var taskgroupID = watchkeeps.taskgroupID;
        var selector = {
          $and: [
            { userID: userID },
            { taskgroupID: taskgroupID }
          ]
        };
        var taskgrouplists = Taskgrouplists.find(selector);
        var count = taskgrouplists.count();
        if (count == 1) {
          taskgrouplists.forEach(function (taskgrouplist) {
            var status = Taskgrouplists.remove(taskgrouplist._id);
            console.info('status from taskgrouplist count = 1', status);
          });
        }
      }

      var status = Watchkeepers.remove(task._id);
      console.info('remove status', status);
    }

    this.saveWork = function () {
      this.showNotif = true;
      console.info('this.watchkeep', this.watchkeep);
      var watchkeepID = this.watchkeep._id;
      $scope.watchkeepStatus = this.watchkeep.status;
      $scope.watchkeepTime = this.watchkeep.time;
      $scope.watchkeepTaskGroup = this.watchkeep.taskGroup;
      $scope.watchkeepTask = this.watchkeep.task;
      var selector = { watchkeepID: watchkeepID };
      var watchkeepers = Watchkeepers.find(selector);
      var count = watchkeepers.count();
      console.info('watchkeepers found', count);
      watchkeepers.forEach(function (watchkeeper) {
        var watchkeeperID = watchkeeper._id;
        Watchkeepers.update({
          _id: watchkeeperID
        }, {
            $set: {
              status: $scope.watchkeepStatus,
              time: $scope.watchkeepTime,
              taskGroup: $scope.watchkeepTaskGroup,
              task: $scope.watchkeepTask
            }
          }, (error) => {
            if (error) {
              console.log('Oops, unable to update the job...');
            } else {
              console.log('Done!');
            }
          });

      });
      Watchkeeps.update({
        _id: this.watchkeep._id
      }, {
          $set: {
            status: this.watchkeep.status,
            time: this.watchkeep.time,
            taskGroup: this.watchkeep.taskGroup,
            task: this.watchkeep.task
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the job...');
          } else {
            console.log('Done!');
          }
        });
    }

    this.submit = function () {
      console.info('this.doneby', this.doneby);
      console.info('submitted dates', this.watchDate);
      this.watchkeeper.name = this.doneby.user.firstName + ' ' + this.doneby.user.lastName;
      this.watchkeeper.userID = this.doneby.user.userID;
      this.watchkeeper.boatID = this.doneby.user.boatID;
      this.watchkeeper.watchkeepID = $stateParams.watchkeepId;
      var watchkeeps = Watchkeeps.findOne({
        _id: $stateParams.watchkeepId
      });
      this.watchkeeper.taskGroup = watchkeeps.taskGroup;
      this.watchkeeper.task = watchkeeps.task;
      this.watchkeeper.time = watchkeeps.time;
      this.watchkeeper.withTime = watchkeeps.withTime;
      this.watchkeeper.dates = [];
      var length = this.watchDate.length;
      for (x = 0; x < length; x++) {
        this.watchDate[x].dateTime = parseInt(this.watchDate[x].newdate.getTime());
      }
      for (x = 0; x < length; x++) {
        this.watchkeeper.dates[x] = this.watchDate[x];
      }
      this.watchkeeper.status = true;
      console.info('this.watchkeeper', this.watchkeeper);
      var status = Watchkeepers.insert(this.watchkeeper);
      console.info('status', status);

      var selector = {
        $and: [
          { userID: this.watchkeeper.userID },
          { taskgroupID: watchkeeps.taskgroupID }
        ]
      };
      var taskgrouplists = Taskgrouplists.find(selector);
      var count = taskgrouplists.count();
      console.info('count from taskgrouplist', count);
      if (count == 0) {
        this.grouplist.userID = this.watchkeeper.userID;
        this.grouplist.taskgroupID = watchkeeps.taskgroupID;
        this.grouplist.name = this.watchkeeper.name;
        var status = Taskgrouplists.insert(this.grouplist);
        console.info('status for taskgrouplist', status);
      }

      this.watchkeeper = {};
      this.watchDate = [];
      this.doneby = {};

    }

    this.saveChanges = function (selected) {
      console.info('selected', selected);
      var watchkeeperID = selected._id;
      console.info('watchkeeperID', watchkeeperID);

      Watchkeepers.update({
        _id: watchkeeperID
      }, {
          $set: {
            dates: selected.dates
          }
        }, (error) => {
          if (error) {
            console.info('Oops, unable to update the inventory...', selected.dates);
          } else {
            console.info('Done!', selected.dates);
            this.showNotif2 = true;
          }
        });
    }

    this.removeJob = function () {
      console.info('userID', $scope.userID);
      var profiles = Profiles.find({
        userID: $scope.userID
      });

      console.info('profiles', profiles);
      profiles.forEach(function (profile) {
        if (profile.userID == $scope.userID) {
          console.info('pasok', profile.password);
          console.info('pass ko', $scope.passworD);
          if (profile.password == $scope.passworD) {
            var selector = { watchkeepID: $stateParams.watchkeepId };
            var watchkeeps = Watchkeepers.find(selector);
            var count = watchkeeps.count();
            console.info('watchkeepers found', count);
            watchkeeps.forEach(function (watchkeep) {
              var removeID = watchkeep._id;
              Watchkeepers.remove(removeID);
              console.log('tangal');
            });
            Watchkeeps.remove($stateParams.watchkeepId);
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('watchkeep', {}, { reload: 'watchkeep' });
          } else {
            $scope.notMatch = true;
            $scope.passworD = '';
          }
        }
      });

    }

    this.viewWatchkeeper = function (watchkeeper) {
      console.info('you clicked', watchkeeper);
      this.selectedWatchkeep = watchkeeper;
    }

    this.updateMonday = function (day) {
      console.info('day', day);
      if (day.monday == true) {
        var dayMonday = 1;
      } else {
        var dayMonday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertMonday', watchkeeperID, day.monday, dayMonday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
    this.updateTuesday = function (day) {
      if (day.tuesday == true) {
        var dayTuesday = 2;
      } else {
        var dayTuesday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertTuesday', watchkeeperID, day.tuesday, dayTuesday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
    this.updateWednesday = function (day) {
      if (day.wednesday == true) {
        var dayWednesday = 3;
      } else {
        var dayWednesday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertWednesday', watchkeeperID, day.wednesday, dayWednesday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
    this.updateThursday = function (day) {
      if (day.thursday == true) {
        var dayThursday = 4;
      } else {
        var dayThursday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertThursday', watchkeeperID, day.thursday, dayThursday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
    this.updateFriday = function (day) {
      if (day.friday == true) {
        var dayFriday = 5;
      } else {
        var dayFriday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertFriday', watchkeeperID, day.friday, dayFriday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
    this.updateSaturday = function (day) {
      if (day.saturday == true) {
        var daySaturday = 6;
      } else {
        var daySaturday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertSaturday', watchkeeperID, day.saturday, daySaturday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
    this.updateSunday = function (day) {
      if (day.sunday == true) {
        var daySunday = 0;
      } else {
        var daySunday = 7;
      }
      var watchkeeperID = day._id;
      Meteor.call('upsertSunday', watchkeeperID, day.sunday, daySunday, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }
  }

}

const name = 'watchkeepdetails';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Watchkeepdetails]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('watchkeepdetails', {
          url: '/watchkeepdetails/:watchkeepId',
          template: '<watchkeepdetails></watchkeepdetails>',

          resolve: {
            currentUser($q, $state) {
              if (Meteor.userId() === null) {
                return $q.reject('AUTH_REQUIRED');
              } else {
                var userID = Meteor.userId();
                var access = Meteor.users.findOne({ _id: userID });
                try {
                  if (access.watchkeeping) {
                    return $q.resolve();
                  } else {
                    return $q.reject('LOGGED_IN');
                  }
                } catch (err) {
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

