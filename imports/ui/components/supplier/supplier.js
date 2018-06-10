import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Suppliers } from '../../../api/suppliers';
import template from './supplier.html';

class Supplier {
    constructor($scope, $reactive, $state) {
        //'ngInject';

        $reactive(this).attach($scope);

        this.inventory = {};

        this.perPage = 10;
        this.page = 1;
        this.sort = {
            supplierName: 1
        };
        this.searchText = '';
        this.supplier = {};

        this.subscribe('suppliers', () => [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
        }, this.getReactively('searchText')
        ]);

        //this.subscribe('inventories');

        this.subscribe('users');

        this.helpers({
            suppliers() {
                var selector = {};
                var suppliers = Suppliers.find(selector, {
                    sort: this.getReactively('sort')
                });
                console.info('suppliers', suppliers);
                return suppliers;
            },
            suppliersCount() {
                return Counts.get('numberOfSuppliers');
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
        this.gotoOtherYachts = function () {
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('searchinventory', {}, { reload: 'searchinventory' });
        }
        this.gotoSupplier = function (equipID) {
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('supplier', { equipID: equipID }, { reload: 'supplier' });
        }

        this.submit = function () {
            console.info('supplier', this.supplier);
            this.supplier.date = new Date();
            this.supplier.status = 'true';

            var status = Suppliers.insert(this.supplier);
            console.info('status', status);
            this.supplier = {};
            //this.reset();
        }
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

const name = 'supplier';

//Inventory.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    utilsPagination
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$state', Supplier]
})
    .config(['$stateProvider',
        function ($stateProvider) {
            //'ngInject';
            $stateProvider
                .state('supplier', {
                    url: '/supplier',
                    template: '<supplier></supplier>',
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

