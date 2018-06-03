import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
 
import template from './navigation.html';

class Navigation {

  constructor($scope, $reactive, $stateParams, $state, $rootScope) {
  //'ngInject';

  $reactive(this).attach($scope);
  this.stateHolder = $rootScope;

  console.info('state', this.stateHolder);

  this.subscribe('users');
  
     this.helpers({
       isLoggedIn() {
         return !!Meteor.userId();
       },
       currentUserId() {
         return Meteor.userId();
       }
     });

     this.logout = function() {
      //Accounts.logout();
      Accounts.logout();
      window.setTimeout(function(){
        $state.go('login', {}, {reload: 'login'});
      },2000);
      
      //var _logout = Meteor.logout;
      //    console.log('user loggin out');
      //    _logout.apply(Meteor, arguments);
      //    $state.go('login', {}, {reload: 'login'});
          
      
    }
    this.gotoDashboard = function() {
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
    this.gotoInventory = function() {
      $state.go('inventory', {}, {reload: 'inventory'});
    }
    this.gotoLogbook = function() {
      $state.go('logbook', {}, {reload: 'logbook'});
    }
    this.gotoEmployees = function() {
      $state.go('employees', {}, {reload: 'employees'});
    }
    this.gotoSettings = function() {
      $state.go('settings', {}, {reload: 'settings'});
    }
    }
  
}
 
const name = 'navigation';

//Navigation.$inject = ['$scope', '$reactive', '$stateParams', '$state'];
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', Navigation]
});