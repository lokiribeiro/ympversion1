import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import {pleaseWait} from '../../../startup/please-wait.js';

import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import { Profiles } from '../../../api/profiles';
import { Docs } from '../../../api/docs';
import template from './profilepage.html';
 
class Profilepage {
  constructor($scope, $reactive, $stateParams, $state, Upload) {
    //'ngInject';

    //this.profile = {};
 
    $reactive(this).attach($scope);

    this.employeeId = $stateParams.employeeId;

    this.uploader = new Slingshot.Upload('myFileUploads');

    this.profile = {};

    this.lic = {};

    $scope.doneSearching = false;
    $scope.uploadSuccess = false;
    $scope.lic = {};
    $scope.misce = {};
    this.showNotif = false;
    this.notComplete = false;
    this.newPassword = '';

    this.types = [
      {name: 'Y1', value: 'Y1'},
      {name: 'Y2', value: 'Y2'},
      {name: 'Y3', value: 'Y3'},
      {name: 'Y4', value: 'Y4'}
    ];

    this.statuses = [
      {name: 'Available', value: 'Available'},
      {name: 'Employed', value: 'Employed'},
      {name: 'Onboard', value: 'Onboard'}
    ];

    this.mailings = [
      {name: 'Subscribed', value: 'Subscribed'},
      {name: 'Unsubscribed', value: 'Unsubscribed'}
    ];

    this.departments = [
      {name: 'Engine Department', value: 'Engine Department'},
      {name: 'Interior Department', value: 'Interior Department'},
      {name: 'Deck Department', value: 'Deck Department'},
      {name: 'Galley', value: 'Galley'},
      {name: 'Captain', value: 'Captain'}
    ];

    this.jobtitles = [
      {name: 'Captain', value: 'Captain'},
      {name: 'Chief Mate', value: 'Chief Mate'},
      {name: 'Mate', value: 'Mate'},
      {name: 'Chief Engineer', value: 'Chief Engineer'},
      {name: 'Engineer', value: 'Engineer'},
      {name: 'Chief Stewardess', value: 'Chief Stewardess'},
      {name: 'Stewardess', value: 'Stewardess'},
      {name: 'Bosun', value: 'Bosun'},
      {name: 'Deckhand', value: 'Deckhand'},
      {name: 'Chef', value: 'Chef'}
    ];

    this.terms = [
      {name: 'Permanent', value: 'Permanent'},
      {name: 'Rotation', value: 'Rotation'},
      {name: 'Relief', value: 'Relief'},
      {name: 'All', value: 'All'}
    ];

    this.certificates = [
      {name: 'None', value: 'None'},
      {name: 'Y1', value: 'Y1'},
      {name: 'Y2', value: 'Y2'},
      {name: 'Y3', value: 'Y3'},
      {name: 'Y4', value: 'Y4'},
      {name: 'AEC - Approved Engine Course', value: 'AEC - Approved Engine Course'},
      {name: 'MEOL - Marine Engine Operator License', value: 'MEOL - Marine Engine Operator License'},
      {name: 'R.III/1', value: 'R.III/1'},
      {name: 'R.III/2 - Unlimited', value: 'R.III/2 - Unlimited'},
      {name: 'R.III/3 - 1. Degree and RIII/2.degree', value: 'R.III/3 - 1. Degree and RIII/2.degree'},
      {name: 'R.III/3 - 1. Degree', value: 'R.III/3 - 1. Degree'},
      {name: 'R.III/2 - 2. Degree', value: 'R.III/2 - 2. Degree'},
      {name: 'R.III/3 - 2. Degree', value: 'R.III/3 - 2. Degree'},
      {name: 'Health Certificate', value: 'Health Certificate'},
      {name: 'Medical First Aid', value: 'Medical First Aid'},
      {name: 'Basic Safety Training', value: 'Basic Safety Training'}
    ];

    this.roles = [
      {name: 'admin', value: 'admin'},
      {name: 'user', value: 'user'}
    ];

    console.info('employeeId', this.employeeId);

    this.subscribe('profiles');

    this.subscribe('users');

    this.subscribe('docs');
 
    this.helpers({
      profile() {
        return Profiles.findOne({
            userID: $stateParams.employeeId
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
        var docs = Docs.find({
            userID: $stateParams.employeeId
          });
          console.info('docs', docs);
          return docs;
      },
    });

    this.logout = function() {
      window.loading_screen = pleaseWait({
        logo: "../assets/global/images/logo/logo-white2.png",
        backgroundColor: '#8c9093',
        loadingHtml: "<div class='sk-spinner sk-spinner-wave'><div class='sk-rect1'></div><div class='sk-rect2'></div><div class='sk-rect3'></div><div class='sk-rect4'></div><div class='sk-rect5'></div></div>"
      });
      Accounts.logout();
      window.setTimeout(function(){
        window.loading_screen.finish();
        $state.go('login', {}, {reload: 'login'});
      },2000);
    }

    this.gotoDashboard = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('dashboard', {}, {reload: 'dashboard'});
    }
    this.gotoInventory = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('inventory', {}, {reload: 'inventory'});
    }
    this.gotoLogbook = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('logbook', {}, {reload: 'logbook'});
    }
    this.gotoEmployees = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('employees', {}, {reload: 'employees'});
    }
    this.gotoWatchkeep = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('watchkeep', {}, {reload: 'watchkeep'});
    }
    this.gotoSettings = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('settings', {}, {reload: 'settings'});
    }
    this.gotoAdminPanel = function() {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('adminpanel', {}, {reload: 'adminpanel'});
    }
    this.gotoReports = function(equipID) {
      angular.element("body").removeClass("modal-open");
      var removeMe = angular.element(document.getElementsByClassName("modal-backdrop"));
      removeMe.remove();
      $state.go('reports', {equipID: equipID}, {reload: 'reports'});
    }

    this.uploadCv = function(file, errFiles) {
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
            alert (error);
          }
          else {
            var filename = this.fileHere;
            console.info('profileID', this.profile);
            var profileID = $stateParams.employeeId
            console.info('profileID', profileID);
  
            Meteor.call('upsertCvs', profileID, downloadUrl, function(err, result) {
                  console.log(downloadUrl);
            console.log('success: ' + downloadUrl);
                  if (err) {
                    console.info('err', err);
                    $scope.doneSearching = false;
                    window.setTimeout(function(){
                      $scope.$apply();
                      //this.doneSearching = false;
                    },2000);
  
                 } else {
                   var toasted = 'New file uploaded.';
                   console.info('uploaded', err);
                   $scope.doneSearching = false;
                   console.info('doneSearching', $scope.doneSearching);
                   $scope.uploadSuccess = true;
                   window.setTimeout(function(){
                    $scope.$apply();
                    //this.doneSearching = false;
                  },2000);
                 }
               });
          }
          });
          file.upload = Upload.upload({
              url: '/uploads',
              data: {file: file}
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

  this.uploadPassport = function(file, errFiles) {
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
          alert (error);
        }
        else {
          var filename = this.fileHere;
          console.info('profileID', this.profile);
          var profileID = $stateParams.employeeId
          console.info('profileID', profileID);

          Meteor.call('upsertPassports', profileID, downloadUrl, function(err, result) {
                console.log(downloadUrl);
          console.log('success: ' + downloadUrl);
                if (err) {
                  console.info('err', err);
                  $scope.doneSearching = false;
                  window.setTimeout(function(){
                    $scope.$apply();
                    //this.doneSearching = false;
                  },2000);

               } else {
                 var toasted = 'New file uploaded.';
                 console.info('uploaded', err);
                 $scope.doneSearching = false;
                 console.info('doneSearching', $scope.doneSearching);
                 $scope.uploadSuccess = true;
                 window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);
               }
             });
        }
        });
        file.upload = Upload.upload({
            url: '/uploads',
            data: {file: file}
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
this.uploadPassport = function(file, errFiles) {
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
          alert (error);
        }
        else {
          var filename = this.fileHere;
          console.info('profileID', this.profile);
          var profileID = $stateParams.employeeId
          console.info('profileID', profileID);

          Meteor.call('upsertPassports', profileID, downloadUrl, function(err, result) {
                console.log(downloadUrl);
          console.log('success: ' + downloadUrl);
                if (err) {
                  console.info('err', err);
                  $scope.doneSearching = false;
                  window.setTimeout(function(){
                    $scope.$apply();
                    //this.doneSearching = false;
                  },2000);

               } else {
                 var toasted = 'New file uploaded.';
                 console.info('uploaded', err);
                 $scope.doneSearching = false;
                 console.info('doneSearching', $scope.doneSearching);
                 $scope.uploadSuccess = true;
                 window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);
               }
             });
        }
        });
        file.upload = Upload.upload({
            url: '/uploads',
            data: {file: file}
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

this.uploadPhoto = function(file, errFiles) {
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
        alert (error);
      }
      else {
        var filename = this.fileHere;
        console.info('profileID', this.profile);
        var profileID = $stateParams.employeeId
        var profileID2 = $stateParams.employeeId
        console.info('profileID', profileID);
        var downloadurl = downloadUrl;

        Meteor.call('upsertProfilePhoto', profileID2, downloadurl, function(err, result) {
          console.log(downloadUrl);
          console.log('success: ' + downloadUrl);
          if (err) {
            console.info('err', err);
          } else {
            console.info('uploaded', err);
         }
       });

        Meteor.call('upsertPhoto', profileID, downloadUrl, function(err, result) {
              console.log(downloadUrl);
        console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);

             } else {
               var toasted = 'New file uploaded.';
               console.info('uploaded', err);
               $scope.doneSearching = false;
               console.info('doneSearching', $scope.doneSearching);
               $scope.uploadSuccess = true;
               window.setTimeout(function(){
                $scope.$apply();
                //this.doneSearching = false;
              },2000);
             }
           });
      }
      });
      file.upload = Upload.upload({
          url: '/uploads',
          data: {file: file}
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

this.uploadLicenses = function(file, errFiles) {
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
        alert (error);
      }
      else {
        var filename = this.fileHere;
        console.info('profileID', this.profile);
        var profileID = $stateParams.employeeId
        console.info('profileID', $scope.lic);
        var certType = $scope.lic.certType;
        var expDate = $scope.lic.expDate;

        Meteor.call('upsertLicenses', profileID, downloadUrl, certType, expDate, function(err, result) {
              console.log(downloadUrl);
        console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);

             } else {
               var toasted = 'New file uploaded.';
               console.info('uploaded', err);
               $scope.doneSearching = false;
               console.info('doneSearching', $scope.doneSearching);
               $scope.uploadSuccess = true;
               window.setTimeout(function(){
                $scope.$apply();
                //this.doneSearching = false;
              },2000);
             }
           });
      }
      });
      file.upload = Upload.upload({
          url: '/uploads',
          data: {file: file}
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

this.uploadMisc = function(file, errFiles) {
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
        alert (error);
      }
      else {
        var filename = this.fileHere;
        console.info('profileID', this.profile);
        var profileID = $stateParams.employeeId
        console.info('profileID', $scope.misce);
        var fileName = $scope.misce.fileName;
        var desc = $scope.misce.desc;

        Meteor.call('upsertMisc', profileID, downloadUrl, fileName, desc, function(err, result) {
              console.log(downloadUrl);
        console.log('success: ' + downloadUrl);
              if (err) {
                console.info('err', err);
                $scope.doneSearching = false;
                window.setTimeout(function(){
                  $scope.$apply();
                  //this.doneSearching = false;
                },2000);

             } else {
               var toasted = 'New file uploaded.';
               console.info('uploaded', err);
               $scope.doneSearching = false;
               console.info('doneSearching', $scope.doneSearching);
               $scope.uploadSuccess = true;
               window.setTimeout(function(){
                $scope.$apply();
                //this.doneSearching = false;
              },2000);
             }
           });
      }
      });
      file.upload = Upload.upload({
          url: '/uploads',
          data: {file: file}
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
   
  savePassword() {
    Profiles.update({
      _id: this.profile._id
    }, {
      $set: {
       password : this.newPassword
      }
    }, (error) => {
        if (error) {
          console.log('Oops, unable to update the inventory...');
        } else {
          console.log('Done!');
        }
    });

    var userID = this.profile.userID;
    var password = this.newPassword;
    console.info('userID', userID);

    Meteor.call('changePasswordNow', userID, password, function(err, result) {
      console.log('password: ' + password);
      if (err) {
        console.info('err', err);
      } else {
        console.info('uploaded', err);
     }
   });
  }

  save() {
    Profiles.update({
      _id: this.profile._id
    }, {
      $set: {
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        mailing: this.profile.mailing,
        email: this.profile.email,
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
        }
    });
  }
}
 
const name = 'profilepage';

//Inventorydetails.$inject = ['$scope', '$reactive', '$stateParams'];
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: ['$scope', '$reactive', '$stateParams', '$state', 'Upload', Profilepage]
})
.config(['$stateProvider',
function($stateProvider) {
    //'ngInject';
    $stateProvider
      .state('profilepage', {
        url: '/profilepage/:employeeId',
        template: '<profilepage></profilepage>',
    
        resolve: {
            currentUser($q, $state) {
                if (Meteor.userId() === null) {
                    return $q.reject('AUTH_REQUIRED');
                } else {
                  return $q.resolve();
                };
            }
        }
      });
    }
]);

