import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import Papa from 'papaparse';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Ympjobs } from '../../../api/ympjobs';
import { Ympequipments } from '../../../api/ympequipments';
import { Ympsubgroups } from '../../../api/ympsubgroups';

import template from './adminequipment.html';

class Adminequipment {
  constructor($scope, $reactive, $state, Upload) {
    //'ngInject';

    $reactive(this).attach($scope);

    this.group = {};
    $scope.removeID = '';
    $scope.equipName = '';
    this.subgroup = {};
    this.units = [
      { unit: 'C', value: "C'" },
      { unit: 'BAR', value: 'BAR' },
      { unit: 'Kpa', value: 'Kpa' },
      { unit: 'F', value: "F'" },
      { unit: 'RPM', value: 'RPM' },
      { unit: 'V', value: 'V' },
      { unit: 'Hours', value: 'Hours' },
      { unit: 'I', value: 'I' },
      { unit: 'IH', value: 'I/H' },
      { unit: 'A', value: 'A' },
      { unit: 'kW', value: 'kW' },
      { unit: 'Hz', value: 'Hz' },
      { unit: 'kVA', value: 'kVA' },
      { unit: 'percent', value: '%' },
      { unit: 'm2', value: 'm2' },
      { unit: 'five', value: '5' },
      { unit: 'KPM', value: 'KPM' },
      { unit: 'Others', value: ' ' }
    ];

    this.inputs = [];
    this.option = {};
    this.withoutOptions = true;
    this.sort = {
      name: 1
    };
    $scope.groupNewName = '';

    this.subscribe('users');

    this.subscribe('ympequipments');

    this.subscribe('ympjobs');

    this.subscribe('ympsubgroups');

    this.helpers({
      groups() {
        var selector = {};
        return Ympequipments.find(selector, {
          sort: this.getReactively('sort')
        });
      },
      subgroups() {
        var selector = {};
        return Ympsubgroups.find(selector);
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
    this.gotoEquipments = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipments', {}, { reload: 'equipments' });
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

    this.addField = function () {
      this.inputs.push({});
    }
    this.removeGroup = function () {
      Ympequipments.remove($scope.removeID);
    }
    this.removeGroupConfirm = function (group) {
      console.info('remove group', group);
      $scope.removeID = group._id;
      $scope.equipName = group.name;
    }
    this.deleteRow = function (row) {
      console.info('row', row);
      var rowID = row._id;
      var status = Ympsubgroups.remove(rowID);
      console.info('status', status);
    }
    this.save = function () {
      console.info('group value', this.group)
      this.group.owner = Meteor.userId();
      this.group.date = new Date();
      var status = Ympequipments.insert(this.group);
      this.group = {};
    }

    this.saveChanges = function (group) {
      console.info('group value', group);
      $scope.groupNewName = group.name;
      Ympequipments.update({
        _id: group._id
      }, {
          $set: {
            location: group.location,
            modelNumber: group.modelNumber,
            serialNumber: group.serialNumber,
            manufacturer: group.manufacturer,
            name: group.name
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the party...');
          } else {
            console.log('Done!');
          }
        });

      var selector = { groupID: group._id };
      var editJobs = Ympjobs.find(selector);
      var count = editJobs.count();
      console.info('count', count);
      editJobs.forEach(function (editJob) {
        var jobID = editJob._id;
        Ympjobs.update({
          _id: jobID
        }, {
            $set: {
              group: $scope.groupNewName
            }
          }, (error) => {
            if (error) {
              console.log('Oops, unable to update the party...');
            } else {
              console.log('Done!');
            }
          });
      });
      $scope.groupNewName = '';
    }



    this.addRow = function (passedGroup, unit) {
      console.info('array value', unit);
      console.info('inputs value', this.inputs);
      console.info('passed group', passedGroup);
      var inputs = this.inputs;
      var lenth = inputs.length;
      var optionArray = [];
      for (x = 0; x < lenth; x++) {
        optionArray[x] = this.inputs[x].option;
        this.withoutOptions = false;
      }
      this.subgroup.optionItems = optionArray;
      this.subgroup.groupID = passedGroup._id;
      this.subgroup.unit = unit;
      this.subgroup.withoutOptions = this.withoutOptions;
      console.info('subgroup items', this.subgroup.optionItems);
      var status = Ympsubgroups.insert(this.subgroup);
      this.subgroup = {};
      this.inputs = [];
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
        //equipments.boatID = $scope.boats.boatID;
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
        Ympequipments.insert(equipments, (error) => {
          if (error) {
            console.log('Oops, unable to insert...');
            console.info('error', error);
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

  updatePort(group) {
    console.info('value upon entrance', group.atPort);
    Ympequipments.update({
      _id: group._id
    }, {
        $set: {
          atPort: group.atPort
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
        }
      });

  }

  updateSea(group) {
    console.info('value upon entrance', group.atSea);
    Ympequipments.update({
      _id: group._id
    }, {
        $set: {
          atSea: group.atSea
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
        }
      });

  }


  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';

  }

  filterNow() {
    console.info('searchText', this.searchText);
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
  }
}

const name = 'adminequipment';

//Dashboard.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', 'Upload', Adminequipment]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('adminequipment', {
          url: '/adminequipment',
          template: '<adminequipment></adminequipment>',
          resolve: {
            currentUser($q, $state) {
              if (!Meteor.userId()) {
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

