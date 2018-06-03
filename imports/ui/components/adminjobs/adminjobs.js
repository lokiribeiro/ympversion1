import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';
import {pleaseWait} from '../../../startup/please-wait.js';
import Papa from 'papaparse';

import { Ympjobs } from '../../../api/ympjobs';
import { Ympequipments } from '../../../api/ympequipments';
import template from './adminjobs.html';
 
class Adminjobs {
  constructor($scope, $reactive, $state, Upload) {
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
    this.sortTitle = {
      title: 1
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

    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;

    this.subscribe('ympjobs', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sortTitle')
    }, 
      this.getReactively('searchText')
    ]);

    this.subscribe('users');

    this.subscribe('ympequipments');
 
    this.helpers({
      jobs() {
        var selector = {};  
        var ympjobs =  Ympjobs.find(selector, {
          sort : this.getReactively('sortTitle')
        });
        console.info('parties', ympjobs);
        return ympjobs;
      },
      jobsCount() {
        return Counts.get('numberOfYmpJobs');
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
        var selector = {};
        return Ympequipments.find(selector, {
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
    this.gotoWatchkeep = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeep', {}, {reload: 'watchkeep'});
    }
    this.gotoEquipments = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipments', {}, {reload: 'equipments'});
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
      this.job.unplanned = false;
      console.info('this.job', this.job);
      var selector = {_id: this.job.groupID};
      var group = Ympequipments.findOne(selector);
      console.info('group for submit', group);
      this.job.group = group.name;
      var user = Meteor.user();
      console.info('user with department', user);
      if(user.department) {
        this.job.department = user.department;
      } 
      var status = Ympjobs.insert(this.job);
      this.job = {};
    }

    this.submitUnplanned = function() {
      this.job.owner = Meteor.userId();
      this.job.date = new Date();
      this.job.title = 'Unplanned Job';
      this.job.unplanned = true;
      console.info('this.job', this.job);
      var user = Meteor.user();
      console.info('user with department', user);
      if(user.department) {
        this.job.department = user.department;
      } 
      var status = Ympjobs.insert(this.job);
      this.job = {};
    }

    $scope.createJobs = function(details, index) {
      var detail = details;
      $scope.indexPoint = index;
      var equipments = {};
      console.info('indexPoint', $scope.indexPoint);
      console.info('arraylengthscope', $scope.arrayLength);
      console.info('detail from for loop', detail);
      console.info('arrayLength', parseInt($scope.arrayLength) - 1);
      if($scope.indexPoint == (parseInt($scope.arrayLength) - 1)) {
          $scope.doneSearching = false;
          $scope.uploadSuccess = true;
          window.setTimeout(function(){
            $scope.$apply();
          },2000);
      } else {
        console.info('detail info', detail.equipmentName);
        equipments.group = detail.equipmentName;
        equipments.owner = $scope.userID;
        console.info('boats', $scope.boats);
        equipments.title = detail.title;
        equipments.description = detail.description;
        equipments.hours = detail.hours;
        equipments.days = detail.days;
        if(detail.repeating == 'yes'){
          equipments.repeating = true;
        } else {
          equipments.repeating = false;
        }
        equipments.unplanned = false;
        equipments.date = new Date();
        //equipments.dateTime = equipments.date.getTime();
        /*if(equipments.hours){
          console.log('no lastservice date with hours');
          equipments.dateNext = equipments.dateTime + (equipments.hours*60*60*1000);
          var newDate = equipments.dateNext;
          equipments.date = new Date(newDate);
          equipments.dateTime = equipments.date.getTime();
          equipments.status = false;
        } else if(equipments.days){
          console.log('no lastservice date with days');
          var hours = equipments.days * 24;
          equipments.dateNext = equipments.dateTime + (hours*60*60*1000);
          var newDate = equipments.dateNext;
          equipments.date = new Date(newDate);
          equipments.dateTime = equipments.date.getTime();
          equipments.status = false;
        }*/
        equipments.unplanned = false;
        console.info('save to collection', equipments);
        Ympjobs.insert(equipments, (error) => {
          if (error) {
            console.info('error', error);
            console.log('Oops, unable to insert...');
          } else {
            console.log('Done!');
          }
      });

      }
    }

    this.uploadJobFiles = function(file, errFiles) {
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
           complete: function(results, file) {
              console.info("Parsing complete:", results);
              var length = results.data.length;
              $scope.arrayLength = length;
              console.info("Array length:", length);
              for(i=0;i<length;i++){
                var details = results.data[i];
                console.info('details from parsed CSV', details);
                $scope.createJobs(details, i);
              }
              var file = $scope.fileCSV;
                file.upload = Upload.upload({
                    url: '/uploads',
                    data: {file: file}
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
           error: function(results, file) {
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
 
const name = 'adminjobs';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', 'Upload', Adminjobs]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('adminjobs', {
      url: '/adminjobs',
      template: '<adminjobs></adminjobs>',
      resolve: {
        currentUser($q, $state) {
            if (!Meteor.userId()) {
                return $q.reject('AUTH_REQUIRED');
            } else {
              var userID = Meteor.userId();
              var access = Meteor.users.findOne({_id: userID});
              try{
                if(access.superadmin){
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

