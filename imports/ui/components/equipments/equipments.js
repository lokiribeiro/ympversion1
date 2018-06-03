import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Groups } from '../../../api/groups';
import { Jobs } from '../../../api/jobs';
import { Subgroups } from '../../../api/subgroups';

import template from './equipments.html';
 
class Equipments {
  constructor($scope, $reactive, $state) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    this.group = {};
    $scope.removeID = '';
    $scope.equipName = '';
    this.subgroup = {};
    this.units = [
        {unit: 'C', value: "C'"},
        {unit: 'BAR', value: 'BAR'},
        {unit: 'Kpa', value: 'Kpa'},
        {unit: 'F', value: "F'"},
        {unit: 'RPM', value: 'RPM'},
        {unit: 'V', value: 'V'},
        {unit: 'Hours', value: 'Hours'},
        {unit: 'I', value: 'I'},
        {unit: 'IH', value: 'I/H'},
        {unit: 'A', value: 'A'},
        {unit: 'kW', value: 'kW'},
        {unit: 'Hz', value: 'Hz'},
        {unit: 'kVA', value: 'kVA'},
        {unit: 'percent', value: '%'},
        {unit: 'm2', value: 'm2'},
        {unit: 'five', value: '5'},
        {unit: 'KPM', value: 'KPM'},
        {unit: 'Others', value: ' '}
    ];

    this.inputs = [];
    this.option = {};
    this.withoutOptions = true;
    $scope.groupName = '';

    this.subscribe('users');

    this.subscribe('groups');

    this.subscribe('jobs');

    this.subscribe('subgroups');
 
    this.helpers({
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
        return Groups.find(selector);
      },
      subgroups() {
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
        return Subgroups.find(selector);
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
    this.gotoReports = function(equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('reports', {equipID: equipID}, {reload: 'reports'});
    }
    this.addField = function () {
        this.inputs.push({});
    }
    this.removeGroup = function() {
      Groups.remove($scope.removeID);
    }
    this.removeGroupConfirm = function(group) {
      console.info('remove group', group);
      $scope.removeID = group._id;
      $scope.equipName = group.name;
    }
    this.deleteRow = function(row){
      console.info('row', row);
      var rowID = row._id;
      var status = Subgroups.remove(rowID);
      console.info('status', status);
    }
    this.save = function() {
      console.info('group value', this.group)
      this.group.owner = Meteor.userId();
      this.group.date = new Date();
      this.group.boatID = $scope.userBoatID;
      var status = Groups.insert(this.group);
      this.group = {};
    }
    this.addRow = function(passedGroup, unit) {
      console.info('array value', unit);
      console.info('inputs value', this.inputs);
      console.info('passed group', passedGroup);
      var inputs = this.inputs;
      var lenth = inputs.length;
      var optionArray = [];
      for(x=0;x<lenth;x++){
          optionArray[x] = this.inputs[x].option;
          this.withoutOptions = false;
      }
      this.subgroup.optionItems = optionArray;
      this.subgroup.groupID = passedGroup._id;
      this.subgroup.unit = unit;
      this.subgroup.withoutOptions = this.withoutOptions;
      this.subgroup.boatID = $scope.userBoatID;
      console.info('subgroup items', this.subgroup.optionItems);
      var status = Subgroups.insert(this.subgroup);
      this.subgroup = {};
      this.inputs = [];
    }

    this.saveChanges = function(group) {
      console.info('group value', group)
      $scope.groupName = group.name;
      Groups.update({
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

      /*var selector = {group: $scope.groupName};
      var editJobs = Jobs.find(selector);
      var count = editJobs.count();
      console.info('count', count);
      editJobs.forEach(function(editJob){
        var jobID = editJob._id;
        Jobs.update({
          _id: jobID
        }, {
          $set: {
            group: $scope.groupName
          }
        }, (error) => {
            if (error) {
              console.log('Oops, unable to update the party...');
            } else {
              console.log('Done!');
            }
        });
      });
      $scope.groupName = '';*/
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

  updatePort(group) {
      console.info('value upon entrance', group.atPort);
      Groups.update({
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
    Groups.update({
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
 
const name = 'equipments';

//Dashboard.$inject = ['$scope', '$reactive'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Equipments]
})
.config(['$stateProvider', 
function($stateProvider) {
  //'ngInject';
  $stateProvider
    .state('equipments', {
      url: '/equipments',
      template: '<equipments></equipments>',
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

