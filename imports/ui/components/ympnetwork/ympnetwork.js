import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from '../../../api/profiles';
import template from './ympnetwork.html';

class Ympnetwork {
    constructor($scope, $reactive, $stateParams, $state) {
        //'ngInject';

        $reactive(this).attach($scope);

        this.perPage = 10;
        this.page = 1;
        this.sort = {
            firstName: 1
        };
        this.searchText = '--------';
        this.searchText2 = '';


        this.subscribe('profilesList', () => [{
            sort: this.getReactively('sort')
        }, this.getReactively('searchText')
        ]);

        this.subscribe('users');

        this.helpers({
            profiles() {
                var removed = true;
                var selector = { removed: removed };
                return Profiles.find(selector, {
                    sort: this.getReactively('sort')
                });
            },
            profilesCount() {
                var count = Counts.get('numberOfProfilesList');
                console.info('count', count);
                return count;
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

        this.filterNow = function () {
            this.searchText = this.searchText2;
        }
        this.reset = function () {
            this.searchText = '--------';
            this.searchText2 = '';
        }

    }

    isOwner(inventory) {
        return this.isLoggedIn && inventory.owner === this.currentUserId;
    }
}

const name = 'ympnetwork';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    utilsPagination
]).component(name, {
    template,
    controllerAs: name,
    controller: ['$scope', '$reactive', '$stateParams', '$state', Ympnetwork]
})
    .config(['$stateProvider',
        function ($stateProvider) {
            //'ngInject';
            $stateProvider
                .state('ympnetwork', {
                    url: '/ympnetwork',
                    template: '<ympnetwork></ympnetwork>',

                    resolve: {
                        currentUser($q, $state) {
                            if (Meteor.userId() === null) {
                                return $q.reject('AUTH_REQUIRED');
                            } else {
                                var userID = Meteor.userId();
                                var access = Meteor.users.findOne({ _id: userID });
                                try {
                                    if (access.employees) {
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

