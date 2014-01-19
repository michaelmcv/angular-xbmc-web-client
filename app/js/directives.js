'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('galleryBreadcrumbs', ['version', function(version) {
    return function(scope, elm, attrs) {
        //globals
        var rootGalleryPath = 'nfs://192.168.0.50/media/main/photos';
        var html='<a href="" ng-click="tempRootGallery()">Home</a>';

        //grab end of string to produce context
        //var context = currentGalleryPath.substring( rootGalleryPath.length, currentGalleryPath.length)
        //trim leading and trailing slashes
        //context = context.substring(1,context.length-1);

        //var paths = context.split('/');
        //for(var i = 0; i<paths.length; i++) {
                //html = html + ''
        //}
        elm.text(scope.galleryPath);
    };
  }]);
