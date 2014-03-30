/**
 * A directive for handling images loaded
 * from remote xbmc service
 *
 * When users navigates through the image gallery via the
 * navigation links, a new image request will be handled by
 * loaded from xbmc and delivered into the dom via this directive
 */
define(function() {
    var xbmcGalleryImage = function (xbmcRemoteService) {

        return {
            restrict: 'E',
            template: '<img class="img-responsive img-rounded center-block" />',
            replace: true,
            link: function(scope, element, attrs, controller) {

                attrs.$observe('photoIndex', function(newValue, oldValue){
                    if(newValue != oldValue) {
                        //set the loading image while we are waiting on the promise from the service the new image
                        attrs.$set('src', '/app/img/ajax-loader.gif')

                        xbmcRemoteService.buildImageSrc(newValue, angular.fromJson(attrs.photoGallery)).then(function(result) {

                            var newPhotoSrc = 'http://raspbmc.mmv.ie:3128/' + result.details.path;
                            attrs.$set('src', newPhotoSrc)
                        });
                    }
                });
            }
        };
    }

    xbmcGalleryImage.$inject = ['xbmcRemoteService'];

    return xbmcGalleryImage;
});
