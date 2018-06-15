import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Groups } from '../../../api/groups';
import { Jobs } from '../../../api/jobs';
import { Subgroups } from '../../../api/subgroups';

import template from './equipments.html';

class Equipments {
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

    this.group = {};
    $scope.removeID = '';
    $scope.equipName = '';
    this.subgroup = {};
    this.units = [
      { unit: 'C', value: "C'" },
      { unit: 'BAR', value: 'BAR' },
      { unit: 'Kpa', value: 'Kpa' },
      { unit: 'F', value: "F'" },
      { unit: 'RPM', value: 'RPM' },
      { unit: 'V', value: 'V' },
      { unit: 'Hours', value: 'Hours' },
      { unit: 'I', value: 'I' },
      { unit: 'IH', value: 'I/H' },
      { unit: 'A', value: 'A' },
      { unit: 'kW', value: 'kW' },
      { unit: 'Hz', value: 'Hz' },
      { unit: 'kVA', value: 'kVA' },
      { unit: 'percent', value: '%' },
      { unit: 'm2', value: 'm2' },
      { unit: 'five', value: '5' },
      { unit: 'KPM', value: 'KPM' },
      { unit: 'Others', value: ' ' }
    ];

    this.inputs = [];
    this.option = {};
    this.withoutOptions = true;
    $scope.groupName = '';
    this.showNotif2 = false;

    this.subscribe('users');

    this.subscribe('groups');

    this.subscribe('jobs');

    this.subscribe('subgroups');

    this.helpers({
      groups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if (boats) {
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = { boatID: boatID };
        } else {
          var selector = {};
        }
        return Groups.find(selector);
      },
      subgroups() {
        var userID = Meteor.userId();
        var boats = Meteor.users.findOne(userID);
        console.info('boats', boats);
        if (boats) {
          $scope.userBoatID = boats.boatID;
          var boatID = $scope.userBoatID;
          var selector = { boatID: boatID };
        } else {
          var selector = {};
        }
        return Subgroups.find(selector);
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
    this.gotoEquipments = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipments', {}, { reload: 'equipments' });
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

    this.addField = function () {
      this.inputs.push({});
    }
    this.removeGroup = function () {
      Groups.remove($scope.removeID);
    }
    this.removeGroupConfirm = function (group) {
      console.info('remove group', group);
      $scope.removeID = group._id;
      $scope.equipName = group.name;
    }
    this.deleteRow = function (row) {
      console.info('row', row);
      var rowID = row._id;
      var status = Subgroups.remove(rowID);
      console.info('status', status);
    }
    this.save = function () {
      console.info('group value', this.group)
      this.group.owner = Meteor.userId();
      this.group.date = new Date();
      this.group.boatID = $scope.userBoatID;
      var status = Groups.insert(this.group);
      this.group = {};
    }
    this.addRow = function (passedGroup, unit) {
      console.info('array value', unit);
      console.info('inputs value', this.inputs);
      console.info('passed group', passedGroup);
      var inputs = this.inputs;
      var lenth = inputs.length;
      var optionArray = [];
      for (x = 0; x < lenth; x++) {
        optionArray[x] = this.inputs[x].option;
        this.withoutOptions = false;
      }
      this.subgroup.optionItems = optionArray;
      this.subgroup.groupID = passedGroup._id;
      this.subgroup.unit = unit;
      this.subgroup.withoutOptions = this.withoutOptions;
      this.subgroup.boatID = $scope.userBoatID;
      console.info('subgroup items', this.subgroup.optionItems);
      var status = Subgroups.insert(this.subgroup);
      this.subgroup = {};
      this.inputs = [];
    }

    this.saveChanges = function (group) {
      this.showNotif2 = true;
      console.info('group value', group)
      $scope.groupName = group.name;
      Groups.update({
        _id: group._id
      }, {
          $set: {
            location: group.location,
            modelNumber: group.modelNumber,
            serialNumber: group.serialNumber,
            manufacturer: group.manufacturer,
            name: group.name
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the party...');
          } else {
            console.log('Done!');
            this.showNotif2 = true;
          }
        });
    }

    this.notification2 = function () {
      this.showNotif2 = false;
      console.info('notif daan', this.showNotif);
    }

  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
    console.info('new page', this.page);
  }

  sortChanged(sort) {
    this.sort = sort;
  }

  updatePort(group) {
    console.info('value upon entrance', group.atPort);
    Groups.update({
      _id: group._id
    }, {
        $set: {
          atPort: group.atPort
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
        }
      });
  }

  updateSea(group) {
    console.info('value upon entrance', group.atSea);
    Groups.update({
      _id: group._id
    }, {
        $set: {
          atSea: group.atSea
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
        }
      });
  }

  updateHours(group) {
    console.info('value upon entrance', group.hours);
    Groups.update({
      _id: group._id
    }, {
        $set: {
          hours: group.hours
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the party...');
        } else {
          console.log('Done!');
        }
      });
  }


  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';

  }

  filterNow() {
    console.info('searchText', this.searchText);
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
  }
}

const name = 'equipments';

//Dashboard.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Equipments]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('equipments', {
          url: '/equipments',
          template: '<equipments></equipments>',
          resolve: {
            currentUser($q, $state) {
              if (!Meteor.userId()) {
                return $q.reject('AUTH_REQUIRED');
              } else {
                return $q.resolve();
              };
            }
          }
        });
    }
  ]);

