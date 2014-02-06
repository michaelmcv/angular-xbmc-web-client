define(function() {

    var xbmcWebClientVideoController = function($scope, $location, $anchorScroll, Restangular, xbmcRemoteService) {

        var rootGalleryPath = 'nfs://192.168.0.50/media/main/videos';

        var resetData = function() {
            $scope.hasVideos = false;
            $scope.dirsMetaData = { list: []};
            $scope.videoMetaData = { list: []};
        }

        var retrieveXBMCData = function(path) {

            $scope.galleryPath = path;

            //get media content for dir @ path from remote xbmc service
            var result = xbmcRemoteService.getXbmcMediaData(path, 'directory');

            result.then(function(result) {

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

            //prepare xbmc for download link details
            var result = xbmcRemoteService.getXbmcMediaData(vfsPath, 'prepare');

            result.then(function(result) {

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
    }

    xbmcWebClientVideoController.$inject = ['$scope','$location','$anchorScroll', 'Restangular', 'xbmcRemoteService'];

    return xbmcWebClientVideoController;
});



