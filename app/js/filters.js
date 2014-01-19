'use strict';

/* Filters */

//TODO refactor this to a directive, more appropriate for manipulating HTML
angular.module('myApp.filters', []).
    filter('breadcrumbs', ['version', function(version) {
    return function(currentGalleryPath) {

    }
  }]);
