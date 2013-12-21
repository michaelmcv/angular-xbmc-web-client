'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('xbmcImageDirs', ['Restangular', function(Restangular) {
        return function($scope, elm, attrs) {
            if(!$scope.xbmcRootUrl)
            {
                $scope.xbmcRootUrl = 'nfs://192.168.0.50/media/core/photos';
            }
            var path = $scope.xbmcRootUrl;

            var request = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": { "directory": "'+path+'"}, "id": 1}';

            $scope.hasPhotos = false;
            $scope.dirs = { list: []};
            $scope.photos = { list: []};

            Restangular.all('')
                            .customGETLIST('jsonrpc',{request: request})
                            .then(function(files) {

            console.log(files);

            for(var i = 0; i < files.length; i++) {
                var file = files[i];

                if(file.filetype == 'directory')
                {
                    $scope.dirs.list.push(file);
                }
                else
                {
                    $scope.hasPhotos = true;
                    $scope.photos.list.push(file);
                }
            }

                return files;
            });
        };
  }]).
  directive('xbmcPhotoGallery', ['Restangular', function(Restangular) {
        return function($scope, elm, attrs) {

        };
   }]);
