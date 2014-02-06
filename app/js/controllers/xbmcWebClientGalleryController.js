define(function() {
    var xbmcWebClientGalleryController = function($scope, $location, $anchorScroll, Restangular, xbmcRemoteService) {

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

            //get media content for dir @ path from remote xbmc service
            var result = xbmcRemoteService.getXbmcMediaData(path, 'directory');

            //resolve the data in the returned promise
            result.then(function(result) {

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

            //prepare xbmc for download link details
            var result = xbmcRemoteService.getXbmcMediaData(vfsPath, 'prepare');

            result.then(function(result) {

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
    }

    xbmcWebClientGalleryController.$inject = ['$scope','$location','$anchorScroll', 'Restangular', 'xbmcRemoteService'];

    return xbmcWebClientGalleryController;
});



