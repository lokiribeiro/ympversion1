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

        $('body').removeClass('sidebar-collapsed');
        $('.nav-sidebar li.active ul').css({ display: 'block' });
        $(this).removeClass('menu-collapsed');
        createSideScroll();

        /****  Variables Initiation  ****/
        var doc = document;
        var docEl = document.documentElement;
        var $sidebar = $('.sidebar');
        var $sidebarFooter = $('.sidebar .sidebar-footer');
        var $mainContent = $('.main-content');
        var $pageContent = $('.page-content');
        var $topbar = $('.topbar');
        var $logopanel = $('.logopanel');
        var $sidebarWidth = $(".sidebar").width();
        var content = document.querySelector('.page-content');
        var docHeight = $(document).height();
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        /* ==========================================================*/
        /* BEGIN SIDEBAR                                             */
        function createSideScroll() {
            if ($.fn.mCustomScrollbar) {
                destroySideScroll();
                if (!$('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-collapsed') && !$('body').hasClass('submenu-hover') && $('body').hasClass('fixed-sidebar')) {
                    $('.sidebar-inner').mCustomScrollbar({
                        scrollButtons: {
                            enable: false
                        },
                        autoHideScrollbar: true,
                        scrollInertia: 150,
                        theme: "light-thin",
                        advanced: {
                            updateOnContentResize: true
                        }
                    });
                }
                if ($('body').hasClass('sidebar-top')) {
                    destroySideScroll();
                }
            }
        }

        function destroySideScroll() {
            $('.sidebar-inner').mCustomScrollbar("destroy");
        }

        /* Toggle submenu open */
        this.toggleSidebarMenu = function () {
            console.log('hello sidebar');
            // Check if sidebar is collapsed
            if ($('body').hasClass('sidebar-collapsed')) {
                $('.nav-sidebar .children').css({ display: '' });
            } else {
                $('.nav-active.active .children').css('display', 'block');
            }

            $('.nav-sidebar').on('click', 'li.nav-parent > a', function (e) {
                e.preventDefault();
                if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                if ($('body').hasClass('submenu-hover')) return;
                var parent = $(this).parent().parent();
                parent.children('li.active').children('.children').slideUp(200);
                $('.nav-sidebar .arrow').removeClass('active');
                parent.children('li.active').removeClass('active');

                var sub = $(this).next();
                // var slideOffeset = -200;
                var slideSpeed = 200;

                if (sub.is(":visible")) {
                    $(this).parent().removeClass("active");
                    sub.slideUp(slideSpeed, function () {
                        if ($('body').hasClass('page-sidebar-fixed') == false && $('body').hasClass('page-sidebar-closed') == false) {
                            // App.scrollTo(the, slideOffeset);
                        }
                        // handleSidebarAndContentHeight();
                    });
                } else {
                    $(this).find('.arrow').addClass('active');
                    sub.slideDown(slideSpeed, function () {
                        $(this).parent().addClass("active");
                        if ($('body').hasClass('page-sidebar-fixed') == false && $('body').hasClass('page-sidebar-closed') == false) {
                            //App.scrollTo(the, slideOffeset);
                        }
                        //handleSidebarAndContentHeight();
                    });
                }
                createSideScroll();
            });
        }

        // Add class everytime a mouse pointer hover over it
        var hoverTimeout;
        $('.nav-sidebar > li').hover(function () {
            clearTimeout(hoverTimeout);
            $(this).siblings().removeClass('nav-hover');
            $(this).addClass('nav-hover');
        }, function () {
            var $self = $(this);
            hoverTimeout = setTimeout(function () {
                $self.removeClass('nav-hover');
            }, 200);
        });

        $('.nav-sidebar > li .children').hover(function () {
            clearTimeout(hoverTimeout);
            $(this).closest('.nav-parent').siblings().removeClass('nav-hover');
            $(this).closest('.nav-parent').addClass('nav-hover');
        }, function () {
            var $self = $(this);
            hoverTimeout = setTimeout(function () {
                $(this).closest('.nav-parent').removeClass('nav-hover');
            }, 200);
        });


        // Menu Toggle
        this.toggleSidebar = function () {
            console.log('hello sidebar toggled');
            var body = $('body');
            var bodypos = body.css('position');
            if (bodypos != 'relative') {
                if (!body.hasClass('sidebar-collapsed')) {
                    body.addClass('sidebar-collapsed');
                    $('.nav-sidebar ul').attr('style', '');
                    $(this).addClass('menu-collapsed');
                    destroySideScroll();
                } else {
                    body.removeClass('sidebar-collapsed');
                    $('.nav-sidebar li.active ul').css({ display: 'block' });
                    $(this).removeClass('menu-collapsed');
                    createSideScroll();
                }
            } else {
                if (body.hasClass('sidebar-show'))
                    body.removeClass('sidebar-show');
                else
                    body.addClass('sidebar-show');
            }

            var body = $('body');
            var bodypos = body.css('position');
            windowWidth = $(window).width();
            if (windowWidth < 1024) {
                body.addClass('sidebar-collapsed');
                $('.nav-sidebar ul').attr('style', '');
                $(this).addClass('menu-collapsed');
                destroySideScroll();
            }
            else {
                body.removeClass('sidebar-collapsed');
                $('.nav-sidebar li.active ul').css({ display: 'block' });
                $(this).removeClass('menu-collapsed');
                createSideScroll();
            }
        }

        /* END SIDEBAR                                               */
        /* ========================================================= */

        // Check if sidebar is collapsed
        if ($('body').hasClass('sidebar-collapsed'))
            $('.nav-sidebar .children').css({ display: '' });

        /***** Scroll to top button *****/
        function scrollTop() {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('.scrollup').fadeIn();
                } else {
                    $('.scrollup').fadeOut();
                }
            });
            $('.scrollup').click(function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 1000);
                return false;
            });
        }

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

