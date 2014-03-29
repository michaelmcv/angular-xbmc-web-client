define(function() {
    var xbmcWebClientGalleryController = function($scope, $location, $anchorScroll, Restangular, xbmcRemoteService) {

        var rootGalleryPath = 'nfs://192.168.0.50/media/main/photos';

        var resetData = function() {
            $scope.hasPhotos = false;
            $scope.hasDirs = false;
            $scope.dirsMetaData = { list: []};
            $scope.photoMetaData = { list: []};
            $scope.loadedPhoto = {};
            $scope.galleryIndex = -1;
            $scope.previousGallery = '';
            $scope.isRootGallery = true;
        }

        var retrieveXBMCData = function(path) {

            $scope.galleryPath = path;

            //get media content for dir @ path from remote xbmc service
            var result = xbmcRemoteService.getXbmcMediaData(path, 'directory');

            //resolve the data in the returned promise
            result.then(function(result) {

                for(var i = 0; i < result.files.length; i++) {
                    var file = result.files[i];

                    if(file.filetype == 'directory')
                    {
                        $scope.hasDirs = true;
                        $scope.dirsMetaData.list.push(file);
                    }
                    else
                    {
                        $scope.hasPhotos = true;
                        $scope.photoMetaData.list.push(file);
                    }
                }

                //initialise the galleryIndex at 1st position - directive handles loading images
                if($scope.hasPhotos)
                {
                    $scope.galleryIndex = 0;
                }

                if(!$scope.isRootGallery)
                {
                    $scope.previousGallery = evaluatePrevGallery(path);
                }
            });
        }

        var evaluatePrevGallery = function(emptyNfsGalleryPath)
        {
            //TODO some effort here - come on tidy this up!
            var paths = emptyNfsGalleryPath.slice(0,-1).split("/");
            var prevGallery = {dir:emptyNfsGalleryPath.slice(0,-1).slice(0,-paths[paths.length - 1].length),
                               label:paths[paths.length - 2]}

            return prevGallery;
        }

        $scope.displayPrevPhoto = function() {
            $scope.galleryIndex--;
        }

        $scope.displayNextPhoto = function() {
            $scope.galleryIndex++;
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

            if(galleryPath.slice(0,-1) != rootGalleryPath)
            {
                $scope.isRootGallery = false;
            }

            retrieveXBMCData(galleryPath);
        };

        //TODO tidy this up!
        $scope.tempRootGallery = function() {
            rootGallery();
        }

        //initialise and then get root data
        rootGallery();
    }

    xbmcWebClientGalleryController.$inject = ['$scope','$location','$anchorScroll', 'Restangular', 'xbmcRemoteService'];

    return xbmcWebClientGalleryController;
});



