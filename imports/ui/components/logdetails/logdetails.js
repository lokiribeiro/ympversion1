import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from '../../../api/profiles';
import { Logbooks } from '../../../api/logbooks';
import { Groups } from '../../../api/groups';
import { Subgroups } from '../../../api/subgroups';

import template from './logdetails.html';
 
class Logdetails {
  constructor($scope, $reactive, $state, $stateParams) {
    //'ngInject';
 
    $reactive(this).attach($scope);

    var userBoat = Meteor.user();
    $scope.userBoatID = userBoat.boatID;

    this.logId = $stateParams.logId;

    console.info('logId', this.logId);

    this.port = {};
    this.engineer = {};
    this.sGroup = [];
    this.sort = {
      name: 1
    };
    this.sort2 = {
      itemName: 1
    };
    this.selectedUnitC = 'C';
    this.selectedUnitKpa = 'Kpa';
    this.selectedUnitRPM = 'RPM';
    this.selectedUnitV = 'V';
    this.selectedUnitHours = 'Hours';
    this.selectedUnitI = 'I';
    this.selectedUnitIH = 'IH';
    this.selectedUnit = ' ';
    this.selectedUnitA = 'A';
    this.selectedUnitkW = 'kW';
    this.selectedUnitHz = 'Hz';
    this.selectedUnitkVA = 'kVA';
    this.selectedUnitPercent = '%';
    this.selectedUnitm2 = 'm2';
    this.selectedUnit5 = '5';
    this.selectedUnitKPM = 'KPM';

    $scope.doneSearching = false;
    $scope.uploadSuccess = false;

    this.subscribe('users');

    this.subscribe('profiles', () => [{
    }, this.getReactively('searchText')
    ]);

    this.subscribe('logbooks', () => [{
    }, this.getReactively('searchText')
    ]);

    this.subscribe('groups');
    
    this.subscribe('subgroups');
 
    this.helpers({
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      profiles() {
        return Profiles.find({});
      },
      port() {
        return Logbooks.findOne({
            _id: $stateParams.logId
          });
      },
      groups() {
        var selector = {boatID: $scope.userBoatID};
        return Groups.find(selector, {
          sort : this.getReactively('sort')
        });
      },
      subgroups() {
        var selector = {boatID: $scope.userBoatID};
        return Subgroups.find(selector, {
          sort : this.getReactively('sort2')
        });
      }
    });

    this.logout = function() {
      Accounts.logout();
      window.setTimeout(function(){
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

    this.save = function() {
      this.port.date = new Date();
      this.port.dateTime = this.port.date.getTime();
      this.port.userID = this.engineer.doneBy.userID;
      this.port.name = this.engineer.doneBy.name;
      this.port.type = 'sea';
      console.info('port details', this.port);
      Logbooks.insert(this.port, (error) => {
          if (error) {
            console.log('Oops, unable to insert...');
          } else {
            console.log('Done!');
            $state.go('logbook', {}, {reload: 'logbook'});
          }
      });
    }

}

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

}
 
const name = 'logdetails';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', '$stateParams', Logdetails]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('logdetails', {
        url: '/logdetails/:logId',
        template: '<logdetails></logdetails>',
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

