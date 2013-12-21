'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('GalleryController', ['$scope','Restangular', function($scope, Restangular) {

    var resetData = function() {
        $scope.hasPhotos = false;
        $scope.dirs = { list: []};
        $scope.photoMetaData = { list: []};
        $scope.photos = [];
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
                        $scope.dirs.list.push(file);
                    }
                    else
                    {
                        $scope.hasPhotos = true;
                        $scope.photoMetaData.list.push(file);
                    }
                }

                if($scope.hasPhotos)
                {

                    for(var i = 0; i < $scope.photoMetaData.list.length; i++) {

                        var thisPhoto = {src:''};
                        var photoMetaData = $scope.photoMetaData.list[i];
                        var vfsPath = photoMetaData.file;
                        var request = '{"jsonrpc": "2.0", "method": "Files.preparedownload", "params": { "path": "'+vfsPath+'" }, "id": 1}';

                        Restangular.all('')
                            .customGETLIST('jsonrpc',{request: request})
                            .then(function(result) {

                                thisPhoto.src = 'http://raspbmc.mmv.ie:3128/' + result.details.path;
                                $scope.photos.push(thisPhoto);
                            });

                    }


                }
            });
    }

    //re-load data
    $scope.changeRootContext = function(path){
        resetData();
        retrieveXBMCData(path);
    };

    $scope.returnToStart = function() {

        //reset
        resetData();
        retrieveXBMCData('nfs://192.168.0.50/media/core/photos');

    }

    //photo slider functions
    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };

    //initialise and then get root data
    resetData();
    retrieveXBMCData('nfs://192.168.0.50/media/core/photos');

  }]);