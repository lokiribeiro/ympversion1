import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngFileUpload from 'ng-file-upload';
import Papa from 'papaparse';
//import 'angularjs-datepicker';

import '../../../startup/accounts-config.js';
import '../../../startup/datepicker.js';
import '../../../startup/ngPrint.js';
import '../../../startup/ngPrintElement.js';
import '../../../startup/please-wait.js';
 
import template from './socially.html';
import Navigation from '../navigation/navigation';
import Dashboard from '../dashboard/dashboard';
import Login from '../login/login';
import Inventory from '../inventory/inventory';
import Jobdetails from '../jobdetails/jobdetails';
import Inventorydetails from '../inventorydetails/inventorydetails';
import Employees from '../employees/employees';
import Employeedetails from '../employeedetails/employeedetails';
import Logbook from '../logbook/logbook';
import Newlog from '../newlog/newlog';
import Sealog from '../sealog/sealog';
import Logdetails from '../logdetails/logdetails';
import Equipments from '../equipments/equipments';
import Profilepage from '../profilepage/profilepage';
import Equipmentlist from '../equipmentlist/equipmentlist';
import Adminpanel from '../adminpanel/adminpanel';
import Adminequipment from '../adminequipment/adminequipment';
import Adminjobs from '../adminjobs/adminjobs';
import Adminjobdetails from '../adminjobdetails/adminjobdetails';
import Adminboat from '../adminboat/adminboat';
import Watchkeep from '../watchkeep/watchkeep';
import Watchkeepdetails from '../watchkeepdetails/watchkeepdetails';
import Watchkeeplog from '../watchkeeplog/watchkeeplog';
import Watchkeeplogdetails from '../watchkeeplogdetails/watchkeeplogdetails';
import Taskgroupdetails from '../taskgroupdetails/taskgroupdetails';
import Reports from '../reports/reports';
import Logbookreports from '../logbookreports/logbookreports';
import Searchinventory from '../searchinventory/searchinventory';
import Supplier from '../supplier/supplier';
import Supplierdetails from '../supplierdetails/supplierdetails';
import Productdetails from '../productdetails/productdetails';
import Sendorder from '../sendorder/sendorder';
import Ympnetwork from '../ympnetwork/ympnetwork';
import Searchdetails from '../searchdetails/searchdetails';
 
class Socially {}
 
const name = 'socially';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  Navigation.name,
  Dashboard.name,
  Inventory.name,
  Jobdetails.name,
  Inventorydetails.name,
  Employees.name,
  Login.name,
  Employeedetails.name,
  Logbook.name,
  Newlog.name,
  Sealog.name,
  Logdetails.name,
  Equipments.name,
  Profilepage.name,
  Equipmentlist.name,
  Adminpanel.name,
  Adminequipment.name,
  Adminjobs.name,
  Adminjobdetails.name,
  Adminboat.name,
  Watchkeep.name,
  Watchkeepdetails.name,
  Watchkeeplog.name,
  Watchkeeplogdetails.name,
  Taskgroupdetails.name,
  Reports.name,
  Logbookreports.name,
  Searchinventory.name,
  Supplier.name,
  Supplierdetails.name,
  Productdetails.name,
  Sendorder.name,
  Ympnetwork.name,
  Searchdetails.name,
  'accounts.ui',
  'date-picker',
  'ngPrint',
  'ngPrintElement',
  ngFileUpload
//  '720kb.datepicker'
]).component(name, {
  template,
  controllerAs: name,
  controller: Socially
})
.config(['$locationProvider', '$urlRouterProvider', '$qProvider', '$stateProvider',
function config($locationProvider, $urlRouterProvider, $qProvider, $stateProvider) {
  //'ngInject';
  
  $locationProvider.html5Mode(true);
  
  $urlRouterProvider.otherwise('/not-found');
  
  $qProvider.errorOnUnhandledRejections(false);
  }
])
.run(['$rootScope', '$state', '$stateParams',
function run($rootScope, $state, $stateParams) {
  //'ngInject';
  console.log('daan ditolabas');
  console.info('rootscope', $rootScope);
  console.info('rootscopeobn', $rootScope.$on.$stateChangeError);

  $state.defaultErrorHandler(function(error) {

    console.info('pasok', error);
    console.info('pasok', error.detail);
    // This is a naive example of how to silence the default error handler.
    if(error.detail == 'AUTH_REQUIRED'){
      $state.go('login', {}, {reload: 'login'});
    }
    if(error.detail == 'LOGGED_IN'){
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
  });
}
]);


 
