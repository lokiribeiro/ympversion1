import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { pleaseWait } from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Jobs } from '../../../api/jobs';
import { Docs } from '../../../api/docs';
import { Photos } from '../../../api/photos';
import { Profiles } from '../../../api/profiles';
import { Histories } from '../../../api/histories';
import { Supports } from '../../../api/supports';
import { Groups } from '../../../api/groups';
import template from './jobdetails.html';

class Jobdetails {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
    //'ngInject';
    angular.element(document).ready(function () {
      window.scrollTo(0, 0);
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

    this.jobId = $stateParams.jobId;
    this.stateHolder = $stateParams.stateHolder;
    $scope.userID = Meteor.userId();

    console.info('jobId', this.jobId);
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

    this.departments = [
      { name: 'Engine Department', value: 'Engine Department' },
      { name: 'Interior Department', value: 'Interior Department' },
      { name: 'Deck Department', value: 'Deck Department' },
      { name: 'Galley', value: 'Galley' },
      { name: 'Captain', value: 'Captain' }
    ];
    this.searchText = '';
    this.searchGroup = '';
    $scope.passworD = '';
    this.pageNum = null;
    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    this.showNotif = false;
    this.showNotif2 = false;
    this.notComplete = false;
    $scope.notMatch = false;
    $scope.canDelete = false;

    this.subscribe('jobsList');

    this.subscribe('docs');

    this.subscribe('photos');

    this.subscribe('users');

    this.subscribe('profiles');

    this.subscribe('histories', () => [{
      sort: this.getReactively('sort2')
    }, this.getReactively('searchGroup')
    ]);

    this.subscribe('supports');

    this.subscribe('groups');

    this.helpers({
      job() {
        return Jobs.findOne({
          _id: $stateParams.jobId
        });
      },
      docs() {
        var docs = Docs.find({
          jobID: $stateParams.jobId
        });
        console.info('docs', docs);
        return docs;
      },
      photos() {
        var photos = Photos.find({
          jobID: $stateParams.jobId
        });
        console.info('photos', photos);
        return photos;
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
      profiles() {
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
        return Profiles.find(selector);
      },
      histories() {
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
        return Histories.find(selector);
      },
      supports() {
        return Supports.find({});
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

    this.resetValue = function () {
      $scope.uploadSuccess = false;
    }

    this.notCompleted = function () {

      this.notComplete = false;
      console.info('complete daan', this.notComplete);
    }

    this.delete = function () {
      var jobId = $stateParams.jobId;
      var status = Jobs.remove(jobId);
      console.info('status removed', status);
      $state.go('dashboard', {}, { reload: 'dashboard' });
    }

    this.removeJobConfirm = function (job) {
      console.info('remove job', job);
      $scope.removeID = job._id;
      $scope.jobName = job.title;
      $scope.notMatch = false;
    }

    this.printThis = function (printID) {
      var prtContent = document.getElementById(printID);
      var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

      WinPrint.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');

      // To keep styling
      /*var file = WinPrint.document.createElement("link");
      file.setAttribute("rel", "stylesheet");
      file.setAttribute("type", "text/css");
      file.setAttribute("href", 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
      WinPrint.document.head.appendChild(file);*/


      WinPrint.document.write(prtContent.innerHTML);
      WinPrint.document.close();
      WinPrint.setTimeout(function () {
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
      }, 1000);
    }

    this.saveWork = function () {
      console.info('doneby', this.job.doneBy);
      if (this.job.doneBy) {
        this.history.jobID = this.job._id;
        this.history.title = this.job.title;
        this.history.group = this.job.group;
        this.history.workHistory = this.job.workHistory;
        this.history.dateNow = new Date();
        this.history.dateTime = this.history.dateNow.getTime();
        console.info('profileget', this.job.doneBy);
        this.history.userID = this.job.doneBy.userID;
        this.history.name = this.job.doneBy.firstName + ' ' + this.job.doneBy.lastName;
        this.history.boatID = $scope.userBoatID;
        this.job.status = true;

        Jobs.update({
          _id: this.job._id
        }, {
            $set: {
              status: this.job.status
            }
          }, (error) => {
            if (error) {
              console.log('Oops, unable to update the job...');
            } else {
              console.log('Done!');
            }
          });

        var status = Histories.insert(this.history);
        console.info('status', status);
        this.showNotif = true;
        $state.go('dashboard', {}, { reload: 'dashboard' });

      } else {
        this.notComplete = true;
      }

    }

    this.removeDocs = function (document) {
      console.info('document', document);
      if (document.fileType == 'manual' || document.fileType == 'parts' || document.fileType == 'specification') {
        var selector = { downloadurl: document.downloadurl };
        var documents = Docs.find(selector);
        documents.forEach(function (document) {
          var status = Docs.remove(document._id);
          console.info('status', status);
        });
      } else {
        var status = Docs.remove(document._id);
        console.info('status', status);
      }
    };

    this.removeJob = function () {
      console.info('userID', $scope.userID);
      var profiles = Profiles.find({
        userID: $scope.userID
      });

      console.info('profiles', profiles);
      profiles.forEach(function (profile) {
        if (profile.userID == $scope.userID) {
          console.info('pasok', profile.password);
          console.info('pass ko', $scope.passworD);
          if (profile.password == $scope.passworD) {
            Jobs.remove($scope.removeID);
            angular.element("body").removeClass("modal-open");
            var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
            removeMe.remove();
            $state.go('dashboard', {}, { reload: 'dashboard' });
          } else {
            $scope.notMatch = true;
            $scope.passworD = '';
          }
        }
      });


    }

    this.uploadFiles = function (file, errFiles) {
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
            var profileID = Meteor.userId();

            Meteor.call('upsertDrawing', profileID, downloadUrl, $stateParams.jobId, function (err, result) {
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


    this.uploadManual = function (file, errFiles) {
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
            $scope.profileID = Meteor.userId();
            $scope.downloadUrl = downloadUrl;

            var selector = { _id: $stateParams.jobId };
            var jobs = Jobs.findOne(selector);
            console.info('jobs', jobs);
            $scope.groupFromJob = jobs.group;
            console.info('jobgroup', $scope.groupFromJob);
            var selector = { group: $scope.groupFromJob };
            var jobs = Jobs.find(selector);

            jobs.forEach(function (job) {
              if (job.group == $scope.groupFromJob) {
                var jobID = job._id;
                console.info('pasok jobID', jobID);

                Meteor.call('upsertManual', $scope.profileID, $scope.downloadUrl, jobID, function (err, result) {
                  console.log($scope.downloadUrl);
                  console.log('success: ' + $scope.downloadUrl);
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
            })
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

    this.uploadManualParts = function (file, errFiles) {
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
            $scope.profileID = Meteor.userId();
            $scope.downloadUrl = downloadUrl;

            var selector = { _id: $stateParams.jobId };
            var jobs = Jobs.findOne(selector);
            console.info('jobs', jobs);
            $scope.groupFromJob = jobs.group;
            console.info('jobgroup', $scope.groupFromJob);
            var selector = { group: $scope.groupFromJob };
            var jobs = Jobs.find(selector);

            jobs.forEach(function (job) {
              if (job.group == $scope.groupFromJob) {
                var jobID = job._id;
                console.info('pasok jobID', jobID);

                Meteor.call('upsertManualParts', $scope.profileID, $scope.downloadUrl, jobID, function (err, result) {
                  console.log($scope.downloadUrl);
                  console.log('success: ' + $scope.downloadUrl);
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

    this.uploadSpecs = function (file, errFiles) {
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
            $scope.profileID = Meteor.userId();
            $scope.downloadUrl = downloadUrl;

            var selector = { _id: $stateParams.jobId };
            var jobs = Jobs.findOne(selector);
            console.info('jobs', jobs);
            $scope.groupFromJob = jobs.group;
            console.info('jobgroup', $scope.groupFromJob);
            var selector = { group: $scope.groupFromJob };
            var jobs = Jobs.find(selector);

            jobs.forEach(function (job) {
              if (job.group == $scope.groupFromJob) {
                var jobID = job._id;
                console.info('pasok jobID', jobID);

                Meteor.call('upsertSpecs', $scope.profileID, $scope.downloadUrl, jobID, function (err, result) {
                  console.log($scope.downloadUrl);
                  console.log('success: ' + $scope.downloadUrl);
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

    this.uploadPage = function (file, errFiles) {
      console.info('pasok', file);
      $scope.pageNum = this.pageNum;
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
            var profileID = Meteor.userId();


            Meteor.call('upsertPage', profileID, downloadUrl, $stateParams.jobId, $scope.pageNum, function (err, result) {
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


    this.uploadImage = function (file, errFiles) {
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
            var profileID = Meteor.userId();

            Meteor.call('upsertPhotos', profileID, downloadUrl, $stateParams.jobId, function (err, result) {
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

    this.uploadService = function (file, errFiles) {
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
            var profileID = Meteor.userId();
            var dateNow = new Date();

            Meteor.call('upsertService', profileID, downloadUrl, $stateParams.jobId, dateNow, function (err, result) {
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

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.currentUserId;
  }

  save() {
    if (this.job.lastService) {
      this.job.date = new Date();
      this.job.dateTime = this.job.date.getTime();
      if (this.job.lastServiceHours) {
        if (this.job.hours) {
          console.log('lastservice hours with hours');
          var lastServiceTime = this.job.lastService.getTime();
          var lastServiceHours = parseInt(this.job.hours) - parseInt(this.job.lastServiceHours);
          this.job.dateNext = this.job.dateTime + (lastServiceHours * 60 * 60 * 1000);
          var newDate = this.job.dateNext;
          this.job.date = new Date(newDate);
          this.job.dateTime = this.job.date.getTime();
          this.job.status = true;
        } else if (this.job.days) {
          console.log('lastservice hours with days');
          var lastServiceTime = this.job.lastService.getTime();
          var hours = this.job.days * 24;
          var lastServiceHours = parseInt(hours) - parseInt(this.job.lastServiceHours);
          this.job.dateNext = this.job.dateTime + (lastServiceHours * 60 * 60 * 1000);
          var newDate = this.job.dateNext;
          this.job.date = new Date(newDate);
          this.job.dateTime = this.job.date.getTime();
          this.job.status = true;
        }
        Jobs.update({
          _id: this.job._id
        }, {
            $set: {
              title: this.job.title,
              description: this.job.description,
              location: this.job.location,
              hours: this.job.hours,
              days: this.job.days,
              years: this.job.years,
              group: this.job.group,
              support: this.job.support,
              department: this.job.department,
              modelNumber: this.job.modelNumber,
              serialNumber: this.job.serialNumber,
              manufacturer: this.job.manufacturer,
              status: this.job.status,
              date: this.job.date,
              dateTime: this.job.dateTime,
              lastService: this.job.lastService,
              lastServiceHours: this.job.lastServiceHours
            }
          }, (error) => {
            if (error) {
              console.log('Oops, unable to update the job...');
            } else {
              console.log('Done!');
              this.showNotif2 = true;
            }
          });
      } else {
        if (this.job.hours) {
          console.log('no lastservice hours with hours');
          var lastServiceTime = this.job.lastService.getTime();
          this.job.dateNext = lastServiceTime + (this.job.hours * 60 * 60 * 1000);
          var newDate = this.job.dateNext;
          this.job.date = new Date(newDate);
          this.job.dateTime = this.job.date.getTime();
          this.job.status = false;
        } else if (this.job.days) {
          console.log('no lastservice hours with hours');
          var hours = this.job.days * 24;
          var lastServiceTime = this.job.lastService.getTime();
          this.job.dateNext = lastServiceTime + (hours * 60 * 60 * 1000);
          var newDate = this.job.dateNext;
          this.job.date = new Date(newDate);
          this.job.dateTime = this.job.date.getTime();
          this.job.status = false;
        }
        Jobs.update({
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
              department: this.job.department,
              modelNumber: this.job.modelNumber,
              serialNumber: this.job.serialNumber,
              manufacturer: this.job.manufacturer,
              status: this.job.status,
              date: this.job.date,
              dateTime: this.job.dateTime,
              lastService: this.job.lastService,
              lastServiceHours: this.job.lastServiceHours
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
    } else {
      Jobs.update({
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
            department: this.job.department,
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

  supportSave() {
    this.support.jobID = this.job._id;
    this.date = new Date();
    var status = Supports.insert(this.support);
    console.info('statussupport', status);

  }
}

const name = 'jobdetails';

//Jobdetails.$inject = ['$scope', '$reactive', '$stateParams'];

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Jobdetails]
})
  .config(['$stateProvider',
    function ($stateProvider) {
      //'ngInject';
      $stateProvider
        .state('jobdetails', {
          url: '/jobdetails/:stateHolder/:jobId',
          template: '<jobdetails></jobdetails>',

          resolve: {
            currentUser($q, $state) {
              if (Meteor.userId() === null) {
                return $q.reject('AUTH_REQUIRED');
              } else {
                return $q.resolve();
              };
            }
          },
          onEnter: ['$rootScope', '$stateParams', '$state', function ($rootScope, $stateParams, $state) {
            $rootScope.stateHolder = $stateParams.stateHolder;
          }]
        });
    }
  ]);

