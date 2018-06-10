import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import Papa from 'papaparse';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Boats } from '../../../api/boats';
import { Profiles } from '../../../api/profiles';
import { Groups } from '../../../api/groups';
import { Jobs } from '../../../api/jobs';
import template from './adminpanel.html';

class Adminpanel {
  constructor($scope, $reactive, $state, Upload) {
    //'ngInject';

    $reactive(this).attach($scope);

    this.boat = {};
    this.perPage = 10;
    this.page = 1;
    this.sort = {
      boatID: 1
    };
    this.searchText = '';
    this.newboat = {};
    this.equipments = {};

    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;
    $scope.notMatch = false;
    $scope.canDelete = false;

    $scope.userID = Meteor.userId();

    this.subscribe('boats', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);
    this.subscribe('users');
    this.subscribe('profiles');

    this.helpers({
      boats() {
        $scope.boats = Meteor.user();
        console.info('boats', $scope.boats);
        var boats = Boats.find({}, {
          sort: this.getReactively('sort')
        });
        console.info('boats', boats);
        return boats;
      },
      boatCount() {
        return Counts.get('numberOfBoats');
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
    this.gotoAdminEquipment = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminequipment', {}, { reload: 'adminequipment' });
    }
    this.gotoAdminJobs = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminjobs', {}, { reload: 'adminjobs' });
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


    this.submit = function () {
      this.newboat.date = new Date();
      this.newboat.status = 'active';
      var boatStatus = Boats.insert(this.newboat);
      //this.reset();
    }

    this.switchBoat = function (boat) {
      console.info('boat', boat);
      var boatID = boat._id;
      var boatName = boat.boatName;
      var userID = Meteor.userId();
      var profileUser = userID;
      console.info('profileUser', profileUser);
      console.info('userID', userID);
      Meteor.call('upsertBoatID', userID, boatID, boatName, function (err, detail) {
        console.info('detail', detail);
        if (err) {
          console.info('err', err);
        } else {
          console.info('success', detail);
        }
      });
      var selector = { userID: profileUser };
      var profiles = Profiles.find(selector);
      console.info('profiles', profiles);
      profiles.forEach(function (profile) {
        if (profile.userID == profileUser) {
          profileUser = profile._id;
        }
      });
      console.info('profileUser2', profileUser);
      Meteor.call('upsertBoatIDProfile', profileUser, boatID, boatName, function (err, detail) {
        console.info('detail', detail);
        if (err) {
          console.info('err', err);
        } else {
          console.info('success', detail);
        }
      });
      //this.reset();
    }

    this.removeBoatConfirm = function (boat) {
      console.info('remove boat', boat);
      $scope.removeID = boat._id;
      $scope.jobName = boat.boatName;
      $scope.notMatch = false;
    }

    this.removeBoat = function () {
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
            Boats.remove($scope.removeID);
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('adminpanel', {}, { reload: 'adminpanel' });
          } else {
            $scope.notMatch = true;
            $scope.passworD = '';
          }
        }
      });
    }

    $scope.createEquips = function (details, index) {
      var detail = details;
      $scope.indexPoint = index;
      var equipments = {};
      console.info('indexPoint', $scope.indexPoint);
      console.info('arraylengthscope', $scope.arrayLength);
      console.info('detail from for loop', detail);
      console.info('arrayLength', parseInt($scope.arrayLength) - 1);
      if ($scope.indexPoint == (parseInt($scope.arrayLength) - 1)) {
        $scope.doneSearching = false;
        $scope.uploadSuccess = true;
        window.setTimeout(function () {
          $scope.$apply();
        }, 2000);
      } else {
        console.info('detail info', detail.equipmentName);
        equipments.name = detail.equipmentName;
        if (detail.hours == 'yes') {
          equipments.hours = true;
        } else {
          equipments.hours = false;
        }
        equipments.owner = $scope.userID;
        equipments.date = new Date();
        equipments.boatID = $scope.boats.boatID;
        console.info('boats', $scope.boats);
        equipments.location = detail.location;
        equipments.modelNumber = detail.modelNumber;
        equipments.serialNumber = detail.serialNumber;
        equipments.manufacturer = detail.manufacturer;
        if (detail.atPort == 'yes') {
          equipments.atPort = true;
        } else {
          equipments.atPort = false;
        }
        if (detail.atSea == 'yes') {
          equipments.atSea = true;
        } else {
          equipments.atSea = false;
        }
        console.info('save to collection', equipments);
        Groups.insert(equipments, (error) => {
          if (error) {
            console.log('Oops, unable to insert...');
          } else {
            console.log('Done!');
          }
        });

      }
    }

    $scope.createJobs = function (details, index) {
      var detail = details;
      $scope.indexPoint = index;
      var equipments = {};
      console.info('indexPoint', $scope.indexPoint);
      console.info('arraylengthscope', $scope.arrayLength);
      console.info('detail from for loop', detail);
      console.info('arrayLength', parseInt($scope.arrayLength) - 1);
      if ($scope.indexPoint == (parseInt($scope.arrayLength) - 1)) {
        $scope.doneSearching = false;
        $scope.uploadSuccess = true;
        window.setTimeout(function () {
          $scope.$apply();
        }, 2000);
      } else {
        console.info('detail info', detail.equipmentName);
        equipments.group = detail.equipmentName;
        equipments.owner = $scope.userID;
        equipments.boatID = $scope.boats.boatID;
        console.info('boats', $scope.boats);
        equipments.title = detail.title;
        equipments.description = detail.description;
        equipments.hours = detail.hours;
        equipments.days = detail.days;
        if (detail.repeating == 'yes') {
          equipments.repeating = true;
        } else {
          equipments.repeating = false;
        }
        equipments.unplanned = false;
        equipments.date = new Date();
        equipments.dateTime = equipments.date.getTime();
        if (equipments.hours) {
          console.log('no lastservice date with hours');
          equipments.dateNext = equipments.dateTime + (equipments.hours * 60 * 60 * 1000);
          var newDate = equipments.dateNext;
          equipments.date = new Date(newDate);
          equipments.dateTime = equipments.date.getTime();
          equipments.status = false;
        } else if (equipments.days) {
          console.log('no lastservice date with days');
          var hours = equipments.days * 24;
          equipments.dateNext = equipments.dateTime + (hours * 60 * 60 * 1000);
          var newDate = equipments.dateNext;
          equipments.date = new Date(newDate);
          equipments.dateTime = equipments.date.getTime();
          equipments.status = false;
        }
        equipments.unplanned = false;
        console.info('save to collection', equipments);
        Jobs.insert(equipments, (error) => {
          if (error) {
            console.log('Oops, unable to insert...');
          } else {
            console.log('Done!');
          }
        });

      }
    }


    this.uploadFiles = function (file, errFiles) {
      console.log('pasok');
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      this.progress = 0;
      $scope.done = true;
      if (file) {
        console.log(file);
        $scope.fileCSV = file;

        var config = {
          delimiter: "",	// auto-detect
          newline: "",	// auto-detect
          header: true,
          dynamicTyping: false,
          preview: 0,
          encoding: "",
          worker: false,
          comments: false,
          step: undefined,
          complete: function (results, file) {
            console.info("Parsing complete:", results);
            var length = results.data.length;
            $scope.arrayLength = length;
            console.info("Array length:", length);
            for (i = 0; i < length; i++) {
              var details = results.data[i];
              console.info('details from parsed CSV', details);
              $scope.createEquips(details, i);
            }
            var file = $scope.fileCSV;
            file.upload = Upload.upload({
              url: '/uploads',
              data: { file: file }
            });
            var filename = file.name;
            var path = '/uploads';
            var type = file.type;
            switch (type) {
              case 'text':
                //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
                var method = 'readAsText';
                var encoding = 'utf8';
                break;
              case 'binary':
                var method = 'readAsBinaryString';
                var encoding = 'binary';
                break;
              default:
                var method = 'readAsBinaryString';
                var encoding = 'binary';
                break;
            }
            /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('success maybe?');
              }
            });*/


            file.upload.then(function (response) {
              $timeout(function () {
                console.log(response);
                file.result = response.data;
                $scope.Fresult = response.config.data.file;

                var errs = 0;
                var Fresult = $scope.Fresult;
                console.info('$scope', Fresult);
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
              else {
                console.log('else pa');
              }
            }, function (event) {
              file.progress = Math.min(100, parseInt(100.0 *
                event.loaded / event.total));
              this.progress = file.progress;
              if (this.progress == 100) {
                console.log('transferred up');
              }
              console.log(this.progress);
            });


          },
          error: function (results, file) {
            console.info("Parsing complete:", results);
          },
          download: false,
          skipEmptyLines: false,
          chunk: undefined,
          fastMode: undefined,
          beforeFirstChunk: undefined,
          withCredentials: undefined
        };

        Papa.parse(file, config);
      }
    };

    this.uploadJobFiles = function (file, errFiles) {
      console.log('pasok');
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      this.progress = 0;
      $scope.done = true;
      if (file) {
        console.log(file);
        $scope.fileCSV = file;

        var config = {
          delimiter: "",	// auto-detect
          newline: "",	// auto-detect
          header: true,
          dynamicTyping: false,
          preview: 0,
          encoding: "",
          worker: false,
          comments: false,
          step: undefined,
          complete: function (results, file) {
            console.info("Parsing complete:", results);
            var length = results.data.length;
            $scope.arrayLength = length;
            console.info("Array length:", length);
            for (i = 0; i < length; i++) {
              var details = results.data[i];
              console.info('details from parsed CSV', details);
              $scope.createJobs(details, i);
            }
            var file = $scope.fileCSV;
            file.upload = Upload.upload({
              url: '/uploads',
              data: { file: file }
            });
            var filename = file.name;
            var path = '/uploads';
            var type = file.type;
            switch (type) {
              case 'text':
                //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
                var method = 'readAsText';
                var encoding = 'utf8';
                break;
              case 'binary':
                var method = 'readAsBinaryString';
                var encoding = 'binary';
                break;
              default:
                var method = 'readAsBinaryString';
                var encoding = 'binary';
                break;
            }
            /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('success maybe?');
              }
            });*/


            file.upload.then(function (response) {
              $timeout(function () {
                console.log(response);
                file.result = response.data;
                $scope.Fresult = response.config.data.file;

                var errs = 0;
                var Fresult = $scope.Fresult;
                console.info('$scope', Fresult);
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
              else {
                console.log('else pa');
              }
            }, function (event) {
              file.progress = Math.min(100, parseInt(100.0 *
                event.loaded / event.total));
              this.progress = file.progress;
              if (this.progress == 100) {
                console.log('transferred up');
              }
              console.log(this.progress);
            });


          },
          error: function (results, file) {
            console.info("Parsing complete:", results);
          },
          download: false,
          skipEmptyLines: false,
          chunk: undefined,
          fastMode: undefined,
          beforeFirstChunk: undefined,
          withCredentials: undefined
        };

        Papa.parse(file, config);
      }
    };

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

const name = 'adminpanel';

//Inventory.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', 'Upload', Adminpanel]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('adminpanel', {
          url: '/adminpanel',
          template: '<adminpanel></adminpanel>',
          resolve: {
            currentUser($q, $state) {
              if (Meteor.userId() === null) {
                return $q.reject('AUTH_REQUIRED');
              } else {
                var userID = Meteor.userId();
                var access = Meteor.users.findOne({ _id: userID });
                try {
                  if (access.superadmin) {
                    return $q.resolve();
                  } else {
                    return $q.reject('LOGGED_IN');
                  }
                } catch (err) {
                  return $q.reject('LOGGED_IN');
                }
              };
            }
          }
        });
    }
  ]);

