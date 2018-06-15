import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Ympjobs } from '../../../api/ympjobs';
import { Groups } from '../../../api/groups';
import { Jobs } from '../../../api/jobs';
import { Boats } from '../../../api/boats';
import { Ympequipments } from '../../../api/ympequipments';
import { Docs } from '../../../api/docs';
import template from './adminboat.html';

class Adminboat {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
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

    this.boatId = $stateParams.boatId;
    this.stateHolder = $stateParams.stateHolder;
    $scope.userID = Meteor.userId();

    console.info('jobId', this.boatId);
    console.info('state', this.stateHolder);

    this.job = {};
    this.history = {};
    this.support = {};

    this.uploader = new Slingshot.Upload('myFileUploads');

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.sort2 = {
      dateNow: -1
    };
    this.sort3 = {
      title: 1
    };
    this.searchText = '';
    this.searchGroup = '';
    $scope.passworD = '';
    $scope.newJobID = '';
    this.pageNum = null;
    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;
    $scope.notMatch = false;
    $scope.canDelete = false;
    $scope.existing = false;
    $scope.nonSelected = false;
    this.selectEquip = {};
    this.equipment = {};
    this.jobForBoat = {};
    $scope.jobForBoat = {};

    this.subscribe('ympjobs', () => [{
      sort: this.getReactively('sort3')
    }, this.getReactively('searchText')
    ]);

    this.subscribe('users');

    this.subscribe('boats');

    this.subscribe('ympequipments');

    this.subscribe('groups');

    this.subscribe('jobs');

    this.subscribe('docs');

    this.helpers({
      job() {
        return Ympjobs.find();
      },
      boats() {
        return Boats.findOne({
          _id: $stateParams.boatId
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
      },
      groups() {
        var selector = {};
        return Ympequipments.find(selector, {
          sort: this.getReactively('sort')
        });
      },
      equips() {
        var boatID = $stateParams.boatId;
        var selector = { boatID: boatID };
        return Groups.find(selector);
      },
      jobs() {
        var boatID = $stateParams.boatId;
        var selector = { boatID: boatID };
        return Jobs.find(selector);
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




    this.notification = function () {

      this.showNotif = false;
      console.info('notif daan', this.showNotif);
    }

    this.notification2 = function () {

      this.showNotif2 = false;
      console.info('notif daan', this.showNotif);
    }

    this.notCompleted = function () {

      this.notComplete = false;
      console.info('complete daan', this.notComplete);
    }

    this.delete = function () {
      var jobId = $stateParams.jobId;
      var status = Ympjobs.remove(jobId);
      console.info('status removed', status);
      $state.go('dashboard', {}, { reload: 'dashboard' });
    }

    this.removeJobConfirm = function (job) {
      console.info('remove job', job);
      $scope.removeID = job._id;
      $scope.jobName = job.title;
      $scope.notMatch = false;
    }

    this.resetValue = function () {
      $scope.uploadSuccess = false;
    }

    this.addToBoat = function () {
      $scope.uploadSuccess = false;
      //$scope.dontExists = true;
      console.info('selected', this.selectEquip);
      console.info('boatId', this.boatId);
      $scope.boatID = this.boatId;
      $scope.groupID = this.selectEquip;
      //var boatEquipments = Groups.find();
      //boatEquipments.forEach(function(boatEquipment){
      //  console.info('loob boatId', boatEquipment.boatID);
      //  console.info('boatId', $scope.boatID);
      //  if(boatEquipment.ympequipID == $scope.groupID && boatEquipment.boatID == $scope.boatID){
      //   $scope.existing = true;
      //    $scope.dontExists = false;
      //  }
      //});
      //if($scope.dontExists){
      $scope.existing = false;
      var selector = { _id: $scope.groupID };
      var groups = Ympequipments.findOne(selector);
      console.info('groups', groups);
      /*groups.forEach(function(group){
        if(group._id == $scope.groupID){
          $scope.equip = group;
        }
      });*/
      this.equipment.name = groups.name;
      this.equipment.hours = groups.hours;
      this.equipment.date = new Date();
      this.equipment.location = groups.location;
      this.equipment.modelNumber = groups.modelNumber;
      this.equipment.serialNumber = groups.serialNumber;
      this.equipment.manufacturer = groups.manufacturer;
      this.equipment.atPort = groups.atPort;
      this.equipment.atSea = groups.atSea;
      this.equipment.boatID = this.boatId;
      $scope.boatId = this.boatId;
      this.equipment.ympequipID = $scope.groupID;
      console.info('from DB', this.equipment);
      var status = Groups.insert(this.equipment);

      if (this.includeJobs) {
        var selector = { groupID: $scope.groupID };
        var ympjobs = Ympjobs.find(selector);
        var count = ympjobs.count();
        console.info('count of ympjobs', count);
        ympjobs.forEach(function (jobs) {
          console.info('jobsiteration', jobs);
          $scope.jobForBoat.group = jobs.group;
          $scope.jobForBoat.title = jobs.title;
          $scope.jobForBoat.description = jobs.description;
          $scope.jobForBoat.repeating = jobs.repeating;
          $scope.jobForBoat.unplanned = jobs.unplanned;
          $scope.jobForBoat.hours = jobs.hours;
          $scope.jobForBoat.days = jobs.days;
          $scope.jobForBoat.boatID = $scope.boatId;
          $scope.jobForBoat.ympjobID = $scope.jobID;
          $scope.jobForBoat.department = jobs.department;
          $scope.jobForBoat.date = new Date();
          $scope.jobForBoat.dateTime = $scope.jobForBoat.date.getTime();
          if ($scope.jobForBoat.hours) {
            console.log('no lastservice date with hours');
            $scope.jobForBoat.dateNext = $scope.jobForBoat.dateTime + ($scope.jobForBoat.hours * 60 * 60 * 1000);
            var newDate = $scope.jobForBoat.dateNext;
            $scope.jobForBoat.date = new Date(newDate);
            $scope.jobForBoat.dateTime = $scope.jobForBoat.date.getTime();
            $scope.jobForBoat.status = false;
          } else if ($scope.jobForBoat.days) {
            console.log('no lastservice date with days');
            var hours = $scope.jobForBoat.days * 24;
            $scope.jobForBoat.dateNext = $scope.jobForBoat.dateTime + (hours * 60 * 60 * 1000);
            var newDate = $scope.jobForBoat.dateNext;
            $scope.jobForBoat.date = new Date(newDate);
            $scope.jobForBoat.dateTime = $scope.jobForBoat.date.getTime();
            $scope.jobForBoat.status = false;
          }
          console.info('from DB', $scope.jobForBoat);
          var status = Jobs.insert($scope.jobForBoat);
          $scope.uploadSuccess = true;
          $scope.newJobID = status;
          console.info('status', status);
          var selector = { jobID: jobs._id };
          var jobDocs = Docs.find(selector);
          var count = jobDocs.count();
          console.info('count jobdocs', count);
          jobDocs.forEach(function (jobDoc) {
            var documents = {};
            documents.jobID = $scope.newJobID;
            documents.downloadurl = jobDoc.downloadurl;
            documents.userID = Meteor.userId();
            if (jobDoc.fileType == 'ympdrawings') {
              documents.fileType = 'drawings';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ympmanual') {
              documents.fileType = 'manual';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ympmanualparts') {
              documents.fileType = 'parts';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ympspecification') {
              documents.fileType = 'specification';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ymppage') {
              documents.fileType = 'page';
              documents.page = jobDoc.page;
              var status = Docs.insert(documents);
              console.info('status', status);
            }
          });
        });
      }
      $scope.boatId = '';
      $scope.jobForBoat = {};
      $scope.uploadSuccess = true;
      console.info('status', status);
      $scope.equip = {};
      $scope.uploadSuccess = false;

      //}
    }

    this.addJobToBoat = function () {
      $scope.nonSelected = false;
      if (this.selectJob) {
        $scope.uploadSuccess = false;
        $scope.dontExists = true;
        console.info('selected', this.selectJob);
        console.info('boatId', this.boatId);
        $scope.jobID = this.selectJob;
        var boatJobs = Jobs.find();
        boatJobs.forEach(function (boatJob) {
          if (boatJob.ympjobID == $scope.jobID && boatJob.boatID == $scope.boatID) {
            $scope.existing = true;
            $scope.dontExists = false;
          }
        });
        if ($scope.dontExists) {
          $scope.existing = false;
          var selector = { _id: $scope.jobID };
          var jobs = Ympjobs.findOne(selector);
          console.info('groups', jobs);
          /*groups.forEach(function(group){
            if(group._id == $scope.groupID){
              $scope.equip = group;
            }
          });*/
          this.jobForBoat.group = jobs.group;
          this.jobForBoat.title = jobs.title;
          this.jobForBoat.description = jobs.description;
          this.jobForBoat.repeating = jobs.repeating;
          this.jobForBoat.unplanned = jobs.unplanned;
          this.jobForBoat.hours = jobs.hours;
          this.jobForBoat.days = jobs.days;
          this.jobForBoat.boatID = this.boatId;
          this.jobForBoat.ympjobID = $scope.jobID;
          this.jobForBoat.department = jobs.department;
          this.jobForBoat.date = new Date();
          this.jobForBoat.dateTime = this.jobForBoat.date.getTime();
          if (this.jobForBoat.hours) {
            console.log('no lastservice date with hours');
            this.jobForBoat.dateNext = this.jobForBoat.dateTime + (this.jobForBoat.hours * 60 * 60 * 1000);
            var newDate = this.jobForBoat.dateNext;
            this.jobForBoat.date = new Date(newDate);
            this.jobForBoat.dateTime = this.jobForBoat.date.getTime();
            this.jobForBoat.status = false;
          } else if (this.jobForBoat.days) {
            console.log('no lastservice date with days');
            var hours = this.jobForBoat.days * 24;
            this.jobForBoat.dateNext = this.jobForBoat.dateTime + (hours * 60 * 60 * 1000);
            var newDate = this.jobForBoat.dateNext;
            this.jobForBoat.date = new Date(newDate);
            this.jobForBoat.dateTime = this.jobForBoat.date.getTime();
            this.jobForBoat.status = false;
          }
          console.info('from DB', this.jobForBoat);
          var status = Jobs.insert(this.jobForBoat);
          $scope.uploadSuccess = true;
          $scope.newJobID = status;
          console.info('status', status);
          var selector = { jobID: $scope.jobID };
          var jobDocs = Docs.find(selector);
          var count = jobDocs.count();
          console.info('count jobdocs', count);
          jobDocs.forEach(function (jobDoc) {
            var documents = {};
            documents.jobID = $scope.newJobID;
            documents.downloadurl = jobDoc.downloadurl;
            documents.userID = Meteor.userId();
            if (jobDoc.fileType == 'ympdrawings') {
              documents.fileType = 'drawings';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ympmanual') {
              documents.fileType = 'manual';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ympmanualparts') {
              documents.fileType = 'parts';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ympspecification') {
              documents.fileType = 'specification';
              var status = Docs.insert(documents);
              console.info('status', status);
            } else if (jobDoc.fileType == 'ymppage') {
              documents.fileType = 'page';
              documents.page = jobDoc.page;
              var status = Docs.insert(documents);
              console.info('status', status);
            }
          });

          $scope.equip = {};
          $scope.uploadSuccess = false;
        }
      } else {
        $scope.nonSelected = true;
      }
    }

    this.save = function () {
      Boats.update({
        _id: $stateParams.boatId
      }, {
          $set: {
            boatName: this.boats.firstName,
            captain: this.boats.captain,
            type: this.boats.type,
            model: this.boats.model,
            year: this.boats.year,
            refit: this.boats.refit,
            builder: this.boats.builder,
            callSign: this.boats.callSign,
            flag: this.boats.flag,
            class: this.boats.class,
            length: this.boats.length,
            beam: this.boats.beam,
            draft: this.boats.draft,
            totalPower: this.boats.totalPower,
            homePort: this.boats.homePort,
            grossTonnage: this.boats.grossTonnage,
            crew: this.boats.crew
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the inventory...');
          } else {
            console.log('Done!');
            this.showNotif2 = true;
          }
        });
    }

  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  save() {
    Ympjobs.update({
      _id: this.job._id
    }, {
        $set: {
          title: this.job.title,
          description: this.job.description,
          location: this.job.location,
          hours: this.job.hours,
          years: this.job.years,
          group: this.job.group,
          support: this.job.support,
          modelNumber: this.job.modelNumber,
          serialNumber: this.job.serialNumber,
          manufacturer: this.job.manufacturer
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the job...');
        } else {
          console.log('Done!');
          this.showNotif2 = true;
        }
      });
  }
}

const name = 'adminboat';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Adminboat]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('adminboat', {
          url: '/adminboat/:boatId',
          template: '<adminboat></adminboat>',
          resolve: {
            currentUser($q, $state) {
              if (Meteor.userId() === null) {
                return $q.reject('AUTH_REQUIRED');
              } else {
                var userID = Meteor.userId();
                var access = Meteor.users.findOne({ _id: userID });
                try {
                  if (access.superadmin) {
                    return $q.resolve();
                  } else {
                    return $q.reject('LOGGED_IN');
                  }
                } catch (err) {
                  return $q.reject('LOGGED_IN');
                }
              };
            }
          },
          onEnter: ['$rootScope', '$stateParams', '$state', function ($rootScope, $stateParams, $state) {
            $rootScope.stateHolder = $stateParams.stateHolder;
          }]
        });
    }
  ]);

