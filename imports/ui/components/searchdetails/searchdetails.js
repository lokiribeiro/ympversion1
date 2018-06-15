import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from '../../../api/profiles';
import { Docs } from '../../../api/docs';
import template from './searchdetails.html';

class Searchdetails {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
    //'ngInject';

    //this.profile = {};

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

    this.searchdetailsId = $stateParams.searchdetailsId;

    this.uploader = new Slingshot.Upload('myFileUploads');

    this.profile = {};

    this.lic = {};

    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    $scope.lic = {};
    $scope.misce = {};
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;
    $scope.passworD = '';


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

    this.certificates = [
      { name: 'None', value: 'None' },
      { name: 'Y1', value: 'Y1' },
      { name: 'Y2', value: 'Y2' },
      { name: 'Y3', value: 'Y3' },
      { name: 'Y4', value: 'Y4' },
      { name: 'AEC - Approved Engine Course', value: 'AEC - Approved Engine Course' },
      { name: 'MEOL - Marine Engine Operator License', value: 'MEOL - Marine Engine Operator License' },
      { name: 'R.III/1', value: 'R.III/1' },
      { name: 'R.III/2 - Unlimited', value: 'R.III/2 - Unlimited' },
      { name: 'R.III/3 - 1. Degree and RIII/2.degree', value: 'R.III/3 - 1. Degree and RIII/2.degree' },
      { name: 'R.III/3 - 1. Degree', value: 'R.III/3 - 1. Degree' },
      { name: 'R.III/2 - 2. Degree', value: 'R.III/2 - 2. Degree' },
      { name: 'R.III/3 - 2. Degree', value: 'R.III/3 - 2. Degree' },
      { name: 'Health Certificate', value: 'Health Certificate' },
      { name: 'Medical First Aid', value: 'Medical First Aid' },
      { name: 'Basic Safety Training', value: 'Basic Safety Training' }
    ];

    this.roles = [
      { name: 'admin', value: 'admin' },
      { name: 'user', value: 'user' }
    ];

    this.access = {};

    console.info('employeeId', this.employeeId);

    this.subscribe('profiles');

    this.subscribe('users');

    this.subscribe('docs');

    this.helpers({
      profile() {
        return Profiles.findOne({
          _id: $stateParams.searchdetailsId
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
      docs() {
        var profile = Profiles.findOne({
          _id: $stateParams.searchdetailsId
        });
        var docs = Docs.find({
          userID: profile.userID
        });
        console.info('docs', docs);
        return docs;
      },
      access() {
        var profile = Profiles.findOne({
          _id: $stateParams.searchdetailsId
        });
        $scope.profileId = profile.userID;
        var access = Meteor.users.findOne({
          _id: $scope.profileId
        });
        console.info('access', access);
        return access;
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


    this.updateJobs = function (group) {
      console.info('value upon entrance', group.jobs);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertJobsAccess', $scope.profileId, group.jobs, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateInventory = function (group) {
      console.info('value upon entrance', group.inventory);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertInventoryAccess', $scope.profileId, group.inventory, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.save = function () {
      Profiles.update({
        _id: this.profile._id
      }, {
          $set: {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            mailing: this.profile.mailing,
            email: this.profile.email,
            department: this.profile.department,
            jobtitle: this.profile.jobtitle,
            birthDate: this.profile.birthDate,
            address: this.profile.address,
            phone: this.profile.phone,
            phone2: this.profile.phone2,
            phone3: this.profile.phone3,
            birthDate: this.profile.birthDate,
            skype: this.profile.skype,
            notes: this.profile.notes,
            ecFullName: this.profile.ecFullName,
            ecRelation: this.profile.ecRelation,
            ecContactNum: this.profile.ecContactNum,
            ecContactNum2: this.profile.ecContactNum2,
            ecContactNum3: this.profile.ecContactNum3,
            ecEmail: this.profile.ecEmail,
            ecAddress: this.profile.ecAddress,
            ecSkype: this.profile.ecSkype


          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the inventory...');
          } else {
            console.log('Done!');
            this.showNotif2 = true;
          }
        });
      var selector = { _id: this.profile._id };
      var profiles = Profiles.findOne(selector);
      Meteor.call('upsertDeptTitle', profiles.userID, this.profile.department, this.profile.jobtitle, function (err, detail) {
        console.info('detail', detail);
        if (err) {
          console.info('err', err);
        } else {
          console.info('success', detail);
        }
      });
    }

    this.notification2 = function () {
      this.showNotif2 = false;
      console.info('notif daan', this.showNotif);
    }

    this.updateLogbook = function (group) {
      console.info('value upon entrance', group.logbook);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertLogbookAccess', $scope.profileId, group.logbook, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateEmployees = function (group) {
      console.info('value upon entrance', group.employees);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertEmployeesAccess', $scope.profileId, group.employees, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateReports = function (group) {
      console.info('value upon entrance', group.reports);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertReportsAccess', $scope.profileId, group.reports, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateSettings = function (group) {
      console.info('value upon entrance', group.settings);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertSettingsAccess', $scope.profileId, group.settings, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateWatchkeeping = function (group) {
      console.info('value upon entrance', group.watchkeeping);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertWatchkeepingAccess', $scope.profileId, group.watchkeeping, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateWatchkeeper = function (group) {
      console.info('value upon entrance', group.watchkeeper);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertWatchkeeperAccess', $scope.profileId, group.watchkeeper, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.updateSupplier = function (group) {
      console.info('value upon entrance', group.supplier);
      var profile = Profiles.findOne({
        _id: $stateParams.searchdetailsId
      });
      $scope.profileId = profile.userID;
      console.info('profileId', $scope.profileId);
      Meteor.call('upsertSupplierAccess', $scope.profileId, group.supplier, function (err, result) {
        if (err) {
          console.info('err', err);
        } else {
          console.info('uploaded', err);
        }
      });
    }

    this.onboardEmployee = function () {
      var userID = Meteor.userId();
      console.info('remove my userID', userID);
      var selector = { userID: userID };
      var profile = Profiles.findOne(selector);
      console.info('profile', profile);
      console.info('pass ko', $scope.passworD);
      if (profile.password == $scope.passworD) {
        var setRemove = true;
        var selector = { _id: $stateParams.searchdetailsId };
        var profile = Profiles.findOne(selector);
        var user = Meteor.user();
        $scope.boatID = user.boatID;
        $scope.boatName = user.boatName;

        Meteor.call('upsertOnboardProfile', $stateParams.searchdetailsId, $scope.boatID, $scope.boatName, function (err, result) {
          if (err) {
            console.info('err', err);
          } else {
            console.info('result', result);
          }
        });

        Meteor.call('upsertOnboardUser', profile.userID, $scope.boatID, $scope.boatName, function (err, result) {
          if (err) {
            console.info('err', err);
            window.setTimeout(function () {
              $scope.$apply();
              //this.doneSearching = false;
            }, 2000);
          } else {
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('employees', {}, { reload: 'employees' });
          }
        });
      } else {
        $scope.notMatch = true;
        $scope.passworD = '';
      }
    }

    this.uploadCv = function (file, errFiles) {
      console.info('pasok', file);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);


        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert(error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.searchdetailsId
            console.info('profileID', profileID);

            Meteor.call('upsertCvs', profileID, downloadUrl, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);

              } else {
                var toasted = 'New file uploaded.';
                console.info('uploaded', err);
                $scope.doneSearching = false;
                console.info('doneSearching', $scope.doneSearching);
                $scope.uploadSuccess = true;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);
              }
            });
          }
        });
        file.upload = Upload.upload({
          url: '/uploads',
          data: { file: file }
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
          case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
            file.result = response.data;
            this.Fresult = response.config.data.file;

            var errs = 0;
            var Fresult = this.Fresult;
            console.info('this', Fresult);
          });
        }, function (response) {
          if (response.status > 0)
            this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
        }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
            event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
        });

      }
    };

    this.uploadPassport = function (file, errFiles) {
      console.info('pasok', file);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);


        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert(error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.searchdetailsId
            console.info('profileID', profileID);

            Meteor.call('upsertPassports', profileID, downloadUrl, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);

              } else {
                var toasted = 'New file uploaded.';
                console.info('uploaded', err);
                $scope.doneSearching = false;
                console.info('doneSearching', $scope.doneSearching);
                $scope.uploadSuccess = true;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);
              }
            });
          }
        });
        file.upload = Upload.upload({
          url: '/uploads',
          data: { file: file }
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
          case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
            file.result = response.data;
            this.Fresult = response.config.data.file;

            var errs = 0;
            var Fresult = this.Fresult;
            console.info('this', Fresult);
          });
        }, function (response) {
          if (response.status > 0)
            this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
        }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
            event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
        });

      }
    };
    this.uploadPassport = function (file, errFiles) {
      console.info('pasok', file);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);


        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert(error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.searchdetailsId
            console.info('profileID', profileID);

            Meteor.call('upsertPassports', profileID, downloadUrl, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);

              } else {
                var toasted = 'New file uploaded.';
                console.info('uploaded', err);
                $scope.doneSearching = false;
                console.info('doneSearching', $scope.doneSearching);
                $scope.uploadSuccess = true;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);
              }
            });
          }
        });
        file.upload = Upload.upload({
          url: '/uploads',
          data: { file: file }
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
          case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
            file.result = response.data;
            this.Fresult = response.config.data.file;

            var errs = 0;
            var Fresult = this.Fresult;
            console.info('this', Fresult);
          });
        }, function (response) {
          if (response.status > 0)
            this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
        }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
            event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
        });

      }
    };

    this.uploadPhoto = function (file, errFiles) {
      console.info('pasok', file);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);


        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert(error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.searchdetailsId;
            var profileID2 = $stateParams.searchdetailsId;
            var profileID3 = $scope.profileId;
            console.info('profileID', profileID);
            var downloadurl = downloadUrl;

            Meteor.call('upsertProfilePhoto', profileID2, downloadurl, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });

            Meteor.call('upsertPhotoUser', profileID3, downloadurl, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
              } else {
                console.info('uploaded', err);
              }
            });

            Meteor.call('upsertPhoto', profileID, downloadUrl, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);

              } else {
                var toasted = 'New file uploaded.';
                console.info('uploaded', err);
                $scope.doneSearching = false;
                console.info('doneSearching', $scope.doneSearching);
                $scope.uploadSuccess = true;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);
              }
            });
          }
        });
        file.upload = Upload.upload({
          url: '/uploads',
          data: { file: file }
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
          case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
            file.result = response.data;
            this.Fresult = response.config.data.file;

            var errs = 0;
            var Fresult = this.Fresult;
            console.info('this', Fresult);
          });
        }, function (response) {
          if (response.status > 0)
            this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
        }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
            event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
        });

      }
    };

    this.uploadLicenses = function (file, errFiles) {
      console.info('pasok', $scope.lic);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);


        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert(error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.searchdetailsId
            console.info('profileID', $scope.lic);
            var certType = $scope.lic.certType;
            var expDate = $scope.lic.expDate;

            Meteor.call('upsertLicenses', profileID, downloadUrl, certType, expDate, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);

              } else {
                var toasted = 'New file uploaded.';
                console.info('uploaded', err);
                $scope.doneSearching = false;
                console.info('doneSearching', $scope.doneSearching);
                $scope.uploadSuccess = true;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);
              }
            });
          }
        });
        file.upload = Upload.upload({
          url: '/uploads',
          data: { file: file }
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
          case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
            file.result = response.data;
            this.Fresult = response.config.data.file;

            var errs = 0;
            var Fresult = this.Fresult;
            console.info('this', Fresult);
          });
        }, function (response) {
          if (response.status > 0)
            this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
        }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
            event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
        });

      }
    };

    this.uploadMisc = function (file, errFiles) {
      console.info('pasok', $scope.misce);
      this.progress = 0;
      this.uploadingNow = true;
      this.f = file;
      this.errFile = errFiles && errFiles[0];
      this.fileHere = file.name;
      this.profileID = Meteor.userId();
      $scope.doneSearching = true;
      $scope.uploadSuccess = false;
      if (file) {
        console.log(file);


        this.uploader.send(file, function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading', this.uploader);
            alert(error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.searchdetailsId
            console.info('profileID', $scope.misce);
            var fileName = $scope.misce.fileName;
            var desc = $scope.misce.desc;

            Meteor.call('upsertMisc', profileID, downloadUrl, fileName, desc, function (err, result) {
              console.log(downloadUrl);
              console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);

              } else {
                var toasted = 'New file uploaded.';
                console.info('uploaded', err);
                $scope.doneSearching = false;
                console.info('doneSearching', $scope.doneSearching);
                $scope.uploadSuccess = true;
                window.setTimeout(function () {
                  $scope.$apply();
                  //this.doneSearching = false;
                }, 2000);
              }
            });
          }
        });
        file.upload = Upload.upload({
          url: '/uploads',
          data: { file: file }
        });
        var filename = file.name;
        var path = '/uploads';
        var type = file.type;
        switch (type) {
          case 'text':
            //tODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
            var method = 'readAsText';
            var encoding = 'utf8';
            break;
          case 'binary':
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
          default:
            var method = 'readAsBinaryString';
            var encoding = 'binary';
            break;
        }
        /*Meteor.call('uploadFileFromClient', filename, path, file, encoding, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success maybe?');
          }
        });*/


        file.upload.then(function (response) {
          $timeout(function () {
            console.log(response);
            file.result = response.data;
            this.Fresult = response.config.data.file;

            var errs = 0;
            var Fresult = this.Fresult;
            console.info('this', Fresult);
          });
        }, function (response) {
          if (response.status > 0)
            this.errorMsg = response.status + ': ' + response.data;
          else {
            console.log('else pa');
          }
        }, function (event) {
          file.progress = Math.min(100, parseInt(100.0 *
            event.loaded / event.total));
          this.progress = file.progress;
          if (this.progress == 100) {
            this.uploadingNow = false;
          }
          console.log(this.progress);
        });

      }
    };





  }


}

const name = 'searchdetails';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Searchdetails]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('searchdetails', {
          url: '/searchdetails/:searchdetailsId',
          template: '<searchdetails></searchdetails>',

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

