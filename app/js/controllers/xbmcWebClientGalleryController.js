define(function() {
    var xbmcWebClientGalleryController = function($scope, $location, $anchorScroll, Restangular, xbmcRemoteService) {

        var rootGalleryPath = 'nfs://192.168.0.50/media/main/photos';

        var resetData = function() {
            $scope.hasPhotos = false;
            $scope.hasDirs = false;
            $scope.dirsMetaData = { list: []};
            $scope.photoMetaData = { list: []};
            $scope.loadedPhoto = {};
            $scope.galleryIndex = 0;
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

                if($scope.hasPhotos)
                {
                    $scope.loadedPhoto = {src:'/app/img/ajax-loader.gif'};
                    //load initial photo retrieved from gallery
                    retrieveXbmcPhotoSource($scope.galleryIndex);
                }

                if(!$scope.isRootGallery)
                {
                    $scope.previousGallery = evaluatePrevGallery(path);
                }
            });
        }

        var retrieveXbmcPhotoSource = function(galleryIndex) {

            var thisPhotoMetaData = $scope.photoMetaData.list[galleryIndex];
            var thisPhoto = {index: galleryIndex,src:'', label: thisPhotoMetaData.label};
            var vfsPath = thisPhotoMetaData.file;

            //prepare xbmc for download link details
            var result = xbmcRemoteService.getXbmcMediaData(vfsPath, 'prepare');

            result.then(function(result) {

                thisPhoto.src = 'http://raspbmc.mmv.ie:3128/' + result.details.path;
                $scope.loadedPhoto = thisPhoto;
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
            changeGalleryPhoto();
        }

        $scope.displayNextPhoto = function() {
            $scope.galleryIndex++;
            changeGalleryPhoto();
        }

        var changeGalleryPhoto = function() {
            /*
             * switch out photo image for a gif loader
             * this will be displayed until promise from main photo
             * request has completed
             */
            $scope.loadedPhoto = {src:'/app/img/ajax-loader.gif'};
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



