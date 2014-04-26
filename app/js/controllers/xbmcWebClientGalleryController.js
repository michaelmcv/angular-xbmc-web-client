define(function() {
    var xbmcWebClientGalleryController = function($scope, $location, $anchorScroll, Restangular, xbmcRemoteService, xbmcConstants) {

        var resetData = function() {

            //initial values
            $scope.hasPhotos = false;
            $scope.hasDirs = false;
            $scope.xbmcMetaData = { dirs:{list:[]}, photos:{list:[]}}
            $scope.galleryIndex = -1;
            $scope.previousGallery = '';
            $scope.isRootGallery = true;
        }

        var retrieveXBMCData = function(path) {

            $scope.galleryPath = path;

            //get media content for dir @ path from remote xbmc service
            var result = xbmcRemoteService.getXbmcMediaData(path, xbmcConstants.directoryType);

            //resolve the data in the returned promise
            result.then(function(result) {

                for(var i = 0; i < result.files.length; i++) {
                    var file = result.files[i];

                    if(file.filetype == 'directory')
                    {
                        $scope.hasDirs = true;
                        $scope.xbmcMetaData.dirs.list.push(file);
                    }
                    else
                    {
                        $scope.hasPhotos = true;
                        $scope.xbmcMetaData.photos.list.push(file);
                    }
                }

                // change the galleryIndex at 1st position when we find an image
                // template directive will handle loading of images
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

        $scope.rootGallery = function() {
            $scope.galleryPath = '';

            initialise();
        }

        //load requested data
        $scope.loadGallery = function(galleryPath){

            resetData();

            if(galleryPath.slice(0,-1) != xbmcConstants.rootNfsGalleryPath)
            {
                $scope.isRootGallery = false;
            }

            retrieveXBMCData(galleryPath);
        };

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

        var initialise = function() {
            //reset
            resetData();
            retrieveXBMCData(xbmcConstants.rootNfsGalleryPath);
        }

        //initialise and then get root data
        initialise();
    }

    xbmcWebClientGalleryController.$inject = ['$scope','$location','$anchorScroll', 'Restangular', 'xbmcRemoteService', 'xbmcConstants'];

    return xbmcWebClientGalleryController;
});



