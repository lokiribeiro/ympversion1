import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Products } from '../../../api/products';
import { Profiles } from '../../../api/profiles';
import template from './sendorder.html';

class Sendorder {
    constructor($scope, $reactive, $stateParams, $state) {
        //'ngInject';

        $reactive(this).attach($scope);

        this.inventory = {};
        $scope.messageSent = false;
        $scope.messageNotSent = false;

        this.perPage = 10;
        this.page = 1;
        this.sort = {
            name: 1
        };
        this.searchText = '';
        $scope.thisSupplier = $stateParams.supplierId;
        this.item = {};

        this.options = [
            { name: 'Active', value: true },
            { name: 'Inactive', value: false }
        ];
        this.showNotif2 = false;

        this.subscribe('productList');

        this.subscribe('profiles');

        this.subscribe('users');

        this.helpers({
            product() {
                return Products.findOne({
                    _id: $stateParams.productId
                });
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

        this.delete = function () {
            var inventoryId = $stateParams.inventoryId;
            var status = Inventories.remove(inventoryId);
            console.info('item removed', status);
            $state.go('inventory', {}, { reload: 'inventory' });
        }

        this.save = function () {
            this.showNotif2 = false;
            console.info('save changes', this.supplier);
            console.info('stateParams', $stateParams.supplierId);
            Suppliers.update({
                _id: $stateParams.supplierId
            }, {
                    $set: {
                        name: this.supplier.supplierName,
                        email: this.supplier.email,
                        phone: this.supplier.phone,
                        status: this.supplier.status
                    }
                }, (error) => {
                    if (error) {
                        console.log('Oops, unable to update the inventory...');
                    } else {
                        console.log('Done!');
                    }
                });

            var selector = { supplierID: $stateParams.supplierId };
            var products = Products.find(selector);
            $scope.supplierName = this.supplier.supplierName;
            $scope.email = this.supplier.email;
            $scope.status = this.supplier.status;
            console.info('product count', products.count());
            products.forEach(function (product) {
                Meteor.call('upsertProduct', product._id, $scope.supplierName, $scope.email, $scope.status, function (err, result) {
                    if (err) {
                        this.showNotif2 = false;
                    } else {
                        this.showNotif2 = true;
                    }
                });
            });
            this.showNotif2 = true;
        }

        this.submitOrder = function () {
            $scope.messageSent = false;
            $scope.messageNotSent = false;
            console.info('message Body', this.product);
            if (this.product.message) {
                var messageBody = "<html><div>Order Details:</div><br /><p><b>Item Name: </b>" +
                    this.product.name +
                    " <br /><b>Category: </b>" +
                    this.product.category +
                    " <br /><b>Manufacturer: </b>" +
                    this.product.manufacturer +
                    " <br /><b>Model No: </b>" +
                    this.product.modelNo +
                    " <br /><b>Parts No: </b>" +
                    this.product.partNo +
                    " <br /><b>Amount: </b>" +
                    this.product.amount +
                    " <br /><b>Message: </b><br />" +
                    this.product.message +
                    " <br /></p></html>";
            } else {
                var messageBody = "<html><div>Order Details:</div><br /><p><b>Item Name: </b>" +
                    this.product.name +
                    " <br /><b>Category: </b>" +
                    this.product.category +
                    " <br /><b>Manufacturer: </b>" +
                    this.product.manufacturer +
                    " <br /><b>Model No: </b>" +
                    this.product.modelNo +
                    " <br /><b>Parts No: </b>" +
                    this.product.partNo +
                    " <br /><b>Amount: </b>" +
                    this.product.amount +
                    " <br /></p></html>";
            }
            var toEmail = this.product.email;
            var toName = this.product.supplierName;

            var userID = Meteor.userId();
            var selector = {userID: userID};
            var profile = Profiles.findOne(selector);
            console.info('from profile', profile);
            var fromEmail = profile.email;
            var fromName = profile.firstName + ' ' + profile.lastName;
            


            Meteor.call('sendEmail', toEmail, toName, messageBody, fromEmail, fromName, function (err, result) {
                if (err) {
                    $scope.messageNotSent = true;
                    console.info('error', err);
                    window.setTimeout(function () {
                        $scope.$apply();
                        //this.doneSearching = false;
                      }, 2000);
                } else {
                    $scope.messageSent = true;
                    console.info('result', result);
                    window.setTimeout(function () {
                        $scope.$apply();
                        //this.doneSearching = false;
                      }, 2000);
                }
            });
        }

        this.notification2 = function () {
            this.showNotif2 = false;
            $scope.messageSent = false;
            $scope.messageNotSent = false;
        }



    }

    isOwner(inventory) {
        return this.isLoggedIn && inventory.owner === this.currentUserId;
    }
}

const name = 'sendorder';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    utilsPagination
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$stateParams', '$state', Sendorder]
})
    .config(['$stateProvider',
        function ($stateProvider) {
            //'ngInject';
            $stateProvider
                .state('sendorder', {
                    url: '/sendorder/:productId',
                    template: '<sendorder></sendorder>',

                    resolve: {
                        currentUser($q, $state) {
                            if (Meteor.userId() === null) {
                                return $q.reject('AUTH_REQUIRED');
                            } else {
                                var userID = Meteor.userId();
                                var access = Meteor.users.findOne({ _id: userID });
                                try {
                                    if (access.inventory) {
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

