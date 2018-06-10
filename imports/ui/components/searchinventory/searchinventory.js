import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Inventories } from '../../../api/inventories';
import { Parties } from '../../../api/parties';
import { Products } from '../../../api/products';
import template from './searchinventory.html';

class Searchinventory {
    constructor($scope, $reactive, $state) {
        //'ngInject';

        $reactive(this).attach($scope);

        this.product = {};
        this.name = '';
        this.category = '';
        this.manufacturer = '';
        this.modelNo = '';
        this.partNo = '';
        this.supplierName = '';
        this.minPrice = '';
        this.maxPrice = '';
        this.name2 = '';
        this.category2 = '';
        this.manufacturer2 = '';
        this.modelNo2 = '';
        this.partNo2 = '';
        this.supplierName2 = '';
        this.minPrice2 = '';
        this.maxPrice2 = '';

        this.perPage = 10;
        this.page = 1;
        this.sort = {
            name: 1
        };
        this.searchText = '';

        this.options = [
            { name: 'Yes', value: true },
            { name: 'No', value: false }
        ];

        this.nameUp = false;
        this.categoryUp = false;
        this.manufacturerUp = false;
        this.modelNoUp = false;
        this.partNoUp = false;
        this.totalAmountUp = false;
        this.minAmountUp = false;
        this.departmentUp = false;
        this.criticalUp = false;

        this.departments = [
            { name: 'Engine Department', value: 'Engine Department' },
            { name: 'Interior Department', value: 'Interior Department' },
            { name: 'Deck Department', value: 'Deck Department' },
            { name: 'Galley', value: 'Galley' },
            { name: 'Captain', value: 'Captain' }
        ];

        this.subscribe('productsList', () => [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
        }, this.getReactively('name2'),
        this.getReactively('category2'),
        this.getReactively('manufacturer2'),
        this.getReactively('modelNo2'),
        this.getReactively('partNo2'),
        this.getReactively('supplierName2'),
        this.getReactively('minPrice2'),
        this.getReactively('maxPrice2')
        ]);

        //this.subscribe('inventories');

        this.subscribe('users');

        this.helpers({
            products() {
                var status = 'true';
                var selector = { status: status };
                var products = Products.find(selector, {
                    sort: this.getReactively('sort')
                });
                console.info('products', products.count());
                return products;
            },
            productsCount() {
                return Counts.get('numberOfProductsList');
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

        this.submit = function () {
            this.inventory.owner = Meteor.userId();
            console.info('inventory', this.inventory);
            this.inventory.date = new Date();
            this.inventory.boatID = $scope.userBoatID;
            var status = Inventories.insert(this.inventory);
            console.info('status', status);
            this.inventory = {};
            //this.reset();
        }

        this.reset = function () {
            this.name2 = '';
            this.category2 = '';
            this.manufacturer2 = '';
            this.modelNo2 = '';
            this.partNo2 = '';
            this.supplierName2 = '';
            this.minPrice2 = '';
            this.maxPrice2 = '';
            this.name = '';
            this.category = '';
            this.manufacturer = '';
            this.modelNo = '';
            this.partNo = '';
            this.supplierName = '';
            this.minPrice = '';
            this.maxPrice = '';
        }

        this.filterNow = function () {
            this.name2 = this.name;
            this.category2 = this.category;
            this.manufacturer2 = this.manufacturer;
            this.modelNo2 = this.modelNo;
            this.partNo2 = this.partNo;
            this.supplierName2 = this.supplierName;
            this.minPrice2 = this.minPrice;
            this.maxPrice2 = this.maxPrice;
        }

        this.sortNameUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                name: 1
            };

        }

        this.sortNameDown = function () {
            this.nameUp = true;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                name: -1
            };

        }

        this.sortCategoryUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                category: 1
            };

        }

        this.sortCategoryDown = function () {
            this.nameUp = false;
            this.categoryUp = true;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                category: -1
            };

        }

        this.sortManufacturerUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                manufacturer: 1
            };

        }

        this.sortManufacturerDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = true;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                manufacturer: -1
            };

        }

        this.sortModelNoUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                modelNo: 1
            };

        }

        this.sortModelNoDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = true;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                modelNo: -1
            };

        }

        this.sortPartNoUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                partNo: 1
            };

        }

        this.sortPartNoDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = true;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                partNo: -1
            };

        }

        this.sortTotalAmountUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                totalAmount: 1
            };

        }

        this.sortTotalAmountDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = true;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                totalAmount: -1
            };

        }

        this.sortMinAmountUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                minAmount: 1
            };

        }

        this.sortMinAmountDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = true;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                minAmount: -1
            };

        }

        this.sortDepartmentUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                department: 1
            };

        }

        this.sortDepartmentDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = true;
            this.criticalUp = false;
            this.sort = {
                department: -1
            };

        }

        this.sortCriticalUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                critical: 1
            };

        }

        this.sortCriticalDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = true;
            this.criticalUp = true;
            this.sort = {
                critical: -1
            };

        }

        this.sortPriceUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.priceUp = false;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                price: 1
            };

        }

        this.sortPriceDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.priceUp = true;
            this.totalAmountUp = false;
            this.minAmountUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                price: -1
            };

        }

        this.sortYachtUp = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.priceUp = false;
            this.totalAmountUp = false;
            this.yachtUp = false;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                boatName: 1
            };

        }

        this.sortYachtDown = function () {
            this.nameUp = false;
            this.categoryUp = false;
            this.manufacturerUp = false;
            this.modelNoUp = false;
            this.partNoUp = false;
            this.priceUp = false;
            this.totalAmountUp = false;
            this.yachtUp = true;
            this.departmentUp = false;
            this.criticalUp = false;
            this.sort = {
                boatName: -1
            };

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

const name = 'searchinventory';

//Inventory.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    utilsPagination
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$state', Searchinventory]
})
    .config(['$stateProvider',
        function ($stateProvider) {
            //'ngInject';
            $stateProvider
                .state('searchinventory', {
                    url: '/searchinventory',
                    template: '<searchinventory></searchinventory>',
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

