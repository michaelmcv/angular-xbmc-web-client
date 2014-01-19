'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'restangular',
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {

    //configure routes to access views
    $routeProvider.when('/gallery', {templateUrl: 'partials/partial1.html', controller: 'GalleryController'});
    $routeProvider.when('/videos', {templateUrl: 'partials/partial2.html', controller: 'VideoLibraryController'});
    $routeProvider.otherwise({redirectTo: '/gallery'});

    RestangularProvider.setBaseUrl('http://raspbmc.mmv.ie:3128');

    // Now let's configure the response extractor for each request
    RestangularProvider.setResponseExtractor(function(response, operation, what, url) {

        return response.result;
    })

}]);
