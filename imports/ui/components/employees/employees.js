import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

//import { Users } from '../../../api/users';
import { Profiles } from '../../../api/profiles';
import { Boats } from '../../../api/boats';
import template from './employees.html';

class Employees {
  constructor($scope, $reactive, $state) {
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
    this.details = '';

    this.cancreate = false;

    this.employee = {};
    $scope.profile = {};

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';
    this.showNotif = false;
    $scope.showNotifErr = false;

    $scope.thisUser = Meteor.userId();
    console.info('userID', $scope.thisUser);

    this.types = [
      { name: 'Y1', value: 'Y1' },
      { name: 'Y2', value: 'Y2' },
      { name: 'Y3', value: 'Y3' },
      { name: 'Y4', value: 'Y4' }
    ];

    this.statuses = [
      { name: 'Available', value: 'Available' },
      { name: 'Employed', value: 'Employed' },
      { name: 'Onboard', value: 'Onboard' }
    ];

    this.mailings = [
      { name: 'Subscribed', value: 'Subscribed' },
      { name: 'Unsubscribed', value: 'Unsubscribed' }
    ];

    this.departments = [
      { name: 'Engine Department', value: 'Engine Department' },
      { name: 'Interior Department', value: 'Interior Department' },
      { name: 'Deck Department', value: 'Deck Department' },
      { name: 'Galley', value: 'Galley' },
      { name: 'Captain', value: 'Captain' }
    ];

    this.jobtitles = [
      { name: 'Captain', value: 'Captain' },
      { name: 'Chief Mate', value: 'Chief Mate' },
      { name: 'Mate', value: 'Mate' },
      { name: 'Chief Engineer', value: 'Chief Engineer' },
      { name: 'Engineer', value: 'Engineer' },
      { name: 'Chief Stewardess', value: 'Chief Stewardess' },
      { name: 'Stewardess', value: 'Stewardess' },
      { name: 'Bosun', value: 'Bosun' },
      { name: 'Deckhand', value: 'Deckhand' },
      { name: 'Chef', value: 'Chef' }
    ];

    this.terms = [
      { name: 'Permanent', value: 'Permanent' },
      { name: 'Rotation', value: 'Rotation' },
      { name: 'Relief', value: 'Relief' },
      { name: 'All', value: 'All' }
    ];

    this.roles = [
      { name: 'admin', value: 'admin' },
      { name: 'user', value: 'user' }
    ];



    this.subscribe('users');
    this.subscribe('boats');

    this.subscribe('profiles', () => [{
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.helpers({
      users() {
        return Meteor.users.find({});
      },
      profiles() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if (boats) {
          var boatID = boats.boatID;
          var selector = { boatID: boatID };
        } else {
          var selector = {};
        }
        return Profiles.find(selector, {
          sort: this.getReactively('sort')
        });
      },
      usersCount() {
        return Counts.get('numberOfUsers');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      },
      currentUser() {
        return Meteor.user();
      },
      boatuserID() {
        var boatUser = Meteor.users.find({
          _id: $scope.thisUser
        });
        console.info('boatUser', boatUser);
        boatUser.forEach(function (boat) {
          $scope.boatID = boat.boatID;
          console.info('boatID', boat);
        })
        console.info('boatID', $scope.boatID);
        return $scope.boatID;
      }
    });

    $scope.createProfile = function (details) {
      console.info('employee details', $scope.profile)
      $scope.profile.userID = details;
      var boat = Meteor.user();
      console.info('boat', boat);
      var boatID = boat.boatID;
      var selector = { _id: boatID };
      var boats = Boats.find(selector);
      $scope.profile.boatName = '';
      boats.forEach(function (boat) {
        if (boat._id == boatID) {
          $scope.profile.boatName = boat.boatName;
        }
      })
      console.info('boatName', $scope.profile.boatName);
      $scope.profile.boatID = boatID;
      var jobs = true;
      Meteor.call('upsertNewRoleFromAdmin', details, $scope.profile.role, $scope.profile.department, $scope.profile.jobtitle, boatID, jobs, $scope.profile.boatName, function (err, detail) {
        console.info('detail', detail);
        if (err) {
          console.info('err', err);
        } else {
          console.info('success', detail);
        }
      });
      var downloadurl = '../assets/img/user.jpg';
      Meteor.call('upsertPhotoUser', $scope.profile.userID, downloadurl, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
      var status = Profiles.insert($scope.profile);
      console.info('status', status);
    }

    this.submit = function () {
      $scope.showNotifErr = false;
      this.showNotif = false;
      this.employee.date = new Date();
      this.employee.password = 'Password123';
      this.employee.profilePhoto = '../assets/img/user.jpg';
      this.employee.status == true;
      $scope.profile = this.employee;
      console.info('username', this.employee.username);
      Meteor.call('createUsers', this.employee.username, this.employee.password, this.employee.email, function (err, detail) {
        console.info('detail', detail);
        if (err) {
          console.info('err', err);
          $scope.showNotifErr = true;
          $scope.errMessage = err;
          //window.setTimeout(function () {
          $scope.$apply();
          //}, 2000);
        } else {
          this.userID = detail;
          console.info('success', this.userID);
          this.cancreate = true;
          console.info('cancreate', this.cancreate);
          $scope.createProfile(detail);
          this.employee = {};
        }
      });
    }

    this.notification = function () {

      this.showNotif = false;
      $scope.showNotifErr = false;
      console.info('notif daan', this.showNotif);
    }

    this.addNewUser = function () {
      this.employee = {};
    }

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
    this.gotoReports = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('reports', {}, { reload: 'reports' });
    }
    this.gotoSupplier = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('supplier', {}, { reload: 'supplier' });
    }
    this.gotoYmpnetwork = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('ympnetwork', {}, { reload: 'ympnetwork' });
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

const name = 'employees';

//Employees.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Employees]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('employees', {
          url: '/employees',
          template: '<employees></employees>',
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