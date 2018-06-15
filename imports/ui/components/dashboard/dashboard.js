import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Jobs } from '../../../api/jobs';
import { Parties } from '../../../api/parties';
import { Groups } from '../../../api/groups';
import { Profiles } from '../../../api/profiles';
import template from './dashboard.html';

class Dashboard {
  constructor($scope, $reactive, $state) {
    //'ngInject';

    angular.element(document).ready(function () {
      var jobs = Jobs.find({});
      console.info('jobs on load', jobs);
      var compareDate = new Date();
      $scope.compareDate = compareDate.getTime();
      console.info('$scope.compareDate', $scope.compareDate);


      jobs.forEach(function (job) {
        if (job.dateTime <= $scope.compareDate) {
          if (job.repeating) {
            if (job.hours) {
              job.dateNext = job.dateTime + (job.hours * 60 * 60 * 1000);
              var newDate = job.dateNext;
              job.date = new Date(newDate);
              job.dateTime = job.date.getTime();
              var jobID = job._id;
              var date = job.date;
              var dateTime = job.dateTime;
              var dateNext = job.dateNext;

              Meteor.call('upsertNewJobTime', jobID, date, dateTime, dateNext, function (err, result) {
                console.log('success: ' + job.dateTime);
                if (err) {
                  console.info('err', err);
                } else {
                  console.info('uploaded', err);
                }
              });

            } else if (job.days) {
              var hours = job.days * 24;
              job.dateNext = job.dateTime + (hours * 60 * 60 * 1000);
              var newDate = job.dateNext;
              job.date = new Date(newDate);
              job.dateTime = job.date.getTime();
              var jobID = job._id;
              var date = job.date;
              var dateTime = job.dateTime;
              var dateNext = job.dateNext;

              Meteor.call('upsertNewJobTime', jobID, date, dateTime, dateNext, function (err, result) {
                console.log('success: ' + job.dateTime);
                if (err) {
                  console.info('err', err);
                } else {
                  console.info('uploaded', err);
                }
              });
            }
          }
        }
      });

    });

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
      if ($('body').hasClass('sidebar-collapsed')){
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
    this.toggleSidebar = function() {
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

    this.job = {};
    this.dateFrom = '';
    this.dateTo = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';

    this.perPage = 10;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.sortDate = {
      date: -1
    };
    this.searchText = '';
    this.viewJobs = true;

    this.choices = [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ];

    this.choices2 = [
      { name: 'Yes', value: false },
      { name: 'No', value: true },
    ];

    this.subscribe('parties', () => [{
      limit: parseInt(this.perPage),
      skip: parseInt((this.getReactively('page') - 1) * this.perPage),
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('jobs', () => [{
      sort: this.getReactively('sortDate')
    }, this.getReactively('searchText'),
    this.getReactively('dateFrom2'),
    this.getReactively('dateTo2')
    ]);

    this.subscribe('profiles', () => [{
      sort: this.getReactively('sort')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('users');

    this.subscribe('groups');

    this.helpers({
      parties() {
        var parties = Parties.find({}, {
          sort: this.getReactively('sort')
        });
        console.info('parties', parties);
        return parties;
      },
      jobs() {
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
        var jobs = Jobs.find(selector, {
          sort: this.getReactively('sortDate')
        });
        console.info('parties', jobs);
        return jobs;
      },
      jobsCount() {
        return Counts.get('numberOfJobs');
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
        return Groups.find(selector, {
          sort: this.getReactively('sort')
        });
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

    this.viewFilter = function () {
      this.viewJobs = !this.viewJobs;
      console.info('viewJobs', this.viewJobs);
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
    this.gotoEquipments = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipments', {}, { reload: 'equipments' });
    }
    this.gotoWatchkeep = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeep', {}, { reload: 'watchkeep' });
    }
    this.gotoAdminPanel = function () {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminpanel', {}, { reload: 'adminpanel' });
    }

    this.gotoEquipList = function (equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('equipmentlist', { equipID: equipID }, { reload: 'equipmentlist' });
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

    this.submit = function () {
      this.job.owner = Meteor.userId();
      this.job.date = new Date();
      this.job.dateTime = this.job.date.getTime();
      this.job.boatID = $scope.userBoatID;
      var user = Meteor.user();
      console.info('user with department', user);
      if (user.department) {
        this.job.department = user.department;
      }
      if (this.job.hours) {
        console.log('no lastservice date with hours');
        this.job.dateNext = this.job.dateTime + (this.job.hours * 60 * 60 * 1000);
        var newDate = this.job.dateNext;
        this.job.date = new Date(newDate);
        this.job.dateTime = this.job.date.getTime();
        this.job.status = false;
      } else if (this.job.days) {
        console.log('no lastservice date with days');
        var hours = this.job.days * 24;
        this.job.dateNext = this.job.dateTime + (hours * 60 * 60 * 1000);
        var newDate = this.job.dateNext;
        this.job.date = new Date(newDate);
        this.job.dateTime = this.job.date.getTime();
        this.job.status = false;
      }
      this.job.unplanned = false;
      var user = Meteor.user();
      console.info('user for dept', user);
      this.job.department = user.department;
      console.info('this.job', this.job);
      var status = Jobs.insert(this.job);
      this.job = {};
    }

    this.submitUnplanned = function () {
      this.job.owner = Meteor.userId();
      this.job.date = new Date();
      this.job.dateTime = this.job.date.getTime();
      this.job.title = 'Unplanned Job';
      this.job.unplanned = true;
      this.job.status = false;
      this.job.boatID = $scope.userBoatID;
      var user = Meteor.user();
      console.info('user for dept', user);
      this.job.department = user.department;
      console.info('this.job', this.job);
      var status = Jobs.insert(this.job);
      this.job = {};
    }

    this.confirmRemove = function () {
      var status = false;
      var userID = Meteor.userId();
      Meteor.call('upsertRemoveUser', userID, status, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('result', result);
        }
      });
      var selector = { userID: userID };
      var profile = Profiles.findOne(selector);
      var profileID = profile._id;
      Meteor.call('upsertRemoveProfileConfirm', profileID, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('result', result);
        }
      });
    }

    this.declineRemove = function () {
      var setRemove = false;
      var decline = true;
      var userID = Meteor.userId();
      Meteor.call('upsertDeclineRemove', userID, setRemove, decline, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('result', result);
        }
      });
      var selector = { userID: userID };
      var profile = Profiles.findOne(selector);
      var profileID = profile._id;
      Meteor.call('upsertRemoveProfile', profileID, setRemove, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('result', result);
        }
      });
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

  reset() {
    this.searchText = '';
    this.dateFrom2 = '';
    this.dateTo2 = '';
    this.dateFrom = '';
    this.dateTo = '';

  }

  resetForm() {
    this.job = {};
  }

  filterNow() {
    console.info('searchText', this.searchText);
    this.dateFrom2 = this.dateFrom.getTime();
    this.dateTo2 = this.dateTo.getTime();
  }
}

const name = 'dashboard';

//Dashboard.$inject = ['$scope', '$reactive'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$state', Dashboard]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          template: '<dashboard></dashboard>',
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

