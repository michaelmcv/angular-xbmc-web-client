'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('GalleryController', ['$scope','Restangular', function($scope, Restangular) {

    var resetData = function() {
        $scope.hasPhotos = false;
        $scope.dirsMetaData = { list: []};
        $scope.photoMetaData = { list: []};
        $scope.loadedPhoto = {};
        $scope.galleryIndex = 0;
    }

    var retrieveXBMCData = function(path) {

        $scope.xbmcRootUrl = path;

        var request = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": { "directory": "'+path+'"}, "id": 1}';

        Restangular.all('')
            .customGETLIST('jsonrpc',{request: request})
            .then(function(result) {

                for(var i = 0; i < result.files.length; i++) {
                    var file = result.files[i];

                    if(file.filetype == 'directory')
                    {
                        $scope.dirsMetaData.list.push(file);
                    }
                    else
                    {
                        $scope.hasPhotos = true;
                        $scope.photoMetaData.list.push(file);
                    }
                }

                if($scope.hasPhotos)
                {
                    //load initial photo retrieved from gallery
                   //debugger;
                    retrieveXbmcPhotoSource($scope.galleryIndex);
                }
            });
    }

    //load requested data
    $scope.loadGallery = function(galleryPath){
        resetData();
        retrieveXBMCData(galleryPath);
    };

    var retrieveXbmcPhotoSource = function(galleryIndex) {

        var thisPhotoMetaData = $scope.photoMetaData.list[galleryIndex];
        var thisPhoto = {index: galleryIndex,src:'', label: thisPhotoMetaData.label};
        var vfsPath = thisPhotoMetaData.file;
        var request = '{"jsonrpc": "2.0", "method": "Files.preparedownload", "params": { "path": "'+vfsPath+'" }, "id": 1}';

        Restangular.all('')
            .customGETLIST('jsonrpc',{request: request})
            .then(function(result) {

                thisPhoto.src = 'http://raspbmc.mmv.ie:3128/' + result.details.path;
                $scope.loadedPhoto = thisPhoto;
                //$scope.photos.push(thisPhoto);
            });
    }

    $scope.displayPrevPhoto = function() {
        $scope.galleryIndex--;
        changeGalleryPhoto();
    }

    $scope.displayNextPhoto = function() {
        $scope.galleryIndex++;
        changeGalleryPhoto();
    }

    var changeGalleryPhoto = function() {
        $scope.loadedPhoto = {};
        retrieveXbmcPhotoSource($scope.galleryIndex);
    }

    var rootGallery = function() {
        //reset
        resetData();
        retrieveXBMCData('nfs://192.168.0.50/media/main/photos');
    }

    //TODO tidy this up!
    $scope.tempRootGallery = function() {
        rootGallery();
    }

    //initialise and then get root data
    rootGallery();

  }]);