import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Products } from '../../../api/products';
import template from './productdetails.html';

class Productdetails {
    constructor($scope, $reactive, $stateParams, $state) {
        //'ngInject';

        $reactive(this).attach($scope);

        this.perPage = 3;
        this.page = 1;
        this.sort = {
            name: 1
        };
        this.searchText = '';

        this.options = [
            { name: 'Active', value: true },
            { name: 'Inactive', value: false }
        ];

        this.subscribe('productList');

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
            var inventoryId = $stateParams.productId;
            var status = Inventories.remove(inventoryId);
            console.info('item removed', status);
            $state.go('inventory', {}, { reload: 'inventory' });
        }

        this.save = function () {
            this.showNotif2 = false;

            Meteor.call('upsertProductInfo', $stateParams.productId, this.product.name, this.product.category, this.product.manufacturer,
            this.product.modelNo, this.product.partNo, this.product.price, this.product.status, function (err, result) {
                if (err) {
                    console.info('error', err)
                    this.showNotif2 = false;
                } else {
                    console.info('result', result);
                    this.showNotif2 = true;
                }
            });
            this.showNotif2 = true;
        }

        this.notification2 = function () {

            this.showNotif2 = false;
            console.info('notif daan', this.showNotif);
        }
    }

    isOwner(inventory) {
        return this.isLoggedIn && inventory.owner === this.currentUserId;
    }

}

const name = 'productdetails';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    utilsPagination
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$stateParams', '$state', Productdetails]
})
    .config(['$stateProvider',
        function ($stateProvider) {
            //'ngInject';
            $stateProvider
                .state('productdetails', {
                    url: '/productdetails/:productId',
                    template: '<productdetails></productdetails>',

                    resolve: {
                        currentUser($q, $state) {
                            if (Meteor.userId() === null) {
                                return $q.reject('AUTH_REQUIRED');
                            } else {
                                var userID = Meteor.userId();
                                var access = Meteor.users.findOne({ _id: userID });
                                try {
                                    if (access.supplier) {
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

