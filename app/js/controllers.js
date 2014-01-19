'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('GalleryController', ['$scope','$location','$anchorScroll', 'Restangular', function($scope, $location, $anchorScroll, Restangular) {

    var rootGalleryPath = 'nfs://192.168.0.50/media/main/photos';

    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
    }

    var resetData = function() {
        $scope.hasPhotos = false;
        $scope.dirsMetaData = { list: []};
        $scope.photoMetaData = { list: []};
        $scope.loadedPhoto = {};
        $scope.galleryIndex = 0;
    }

    var retrieveXBMCData = function(path) {

        $scope.galleryPath = path;

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
                    retrieveXbmcPhotoSource($scope.galleryIndex);
                }
            });
    }

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
            });
    }

    $scope.scrollTo = function(id) {
        $location.hash(id);
        $anchorScroll();
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
        $scope.galleryPath = '';

        //reset
        resetData();
        retrieveXBMCData(rootGalleryPath);
    }

    //load requested data
    $scope.loadGallery = function(galleryPath){

        resetData();
        retrieveXBMCData(galleryPath);
    };

    //TODO tidy this up!
    $scope.tempRootGallery = function() {
        rootGallery();
    }

    //initialise and then get root data
    rootGallery();

  }]).
  controller('VideoLibraryController', ['$scope','$location','$anchorScroll', 'Restangular', function($scope, $location, $anchorScroll, Restangular) {

    var rootGalleryPath = 'nfs://192.168.0.50/media/main/videos';

    var resetData = function() {
        $scope.hasVideos = false;
        $scope.dirsMetaData = { list: []};
        $scope.videoMetaData = { list: []};
    }

    var retrieveXBMCData = function(path) {

        $scope.galleryPath = path;

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
                        $scope.hasVideos = true;
                        retrieveXbmcVideoSource(file);
                    }
                }
            });
    }

    var retrieveXbmcVideoSource = function(videoMetaData) {

        var vfsPath = videoMetaData.file;
        var thisVideo = {label: videoMetaData.label,src: ''}
        var request = '{"jsonrpc": "2.0", "method": "Files.preparedownload", "params": { "path": "'+vfsPath+'" }, "id": 1}';

        Restangular.all('')
            .customGETLIST('jsonrpc',{request: request})
            .then(function(result) {

                thisVideo.src = 'http://raspbmc.mmv.ie:3128/' + result.details.path;
                $scope.videoMetaData.list.push(thisVideo);
            });
    }

    var rootGallery = function() {
        $scope.galleryPath = '';

        //reset
        resetData();
        retrieveXBMCData(rootGalleryPath);
    }

    //load requested data
    $scope.loadGallery = function(galleryPath){

        resetData();
        retrieveXBMCData(galleryPath);
    };

    //TODO tidy this up!
    $scope.tempRootGallery = function() {
        rootGallery();
    }

    //initialise and then get root data
    rootGallery();

  }]);