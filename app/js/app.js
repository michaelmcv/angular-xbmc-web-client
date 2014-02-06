define([
    'angular',
    'controllers/xbmcWebClientGalleryController',
    'controllers/xbmcWebClientVideoController',
    'services/xbmcRemoteService',
    'restangular',
    'angularRoute'
    ],function (angular, xbmcWebClientGalleryController, xbmcWebClientVideoController, xbmcRemoteService) {

    'use strict';


    // Declare app level module which depends on filters, and services
    var xbmcWebClientApp = angular.module('xbmcWebClient', [
        'restangular',
        'ngRoute'
        ]);

        xbmcWebClientApp.controller('xbmcWebClientGalleryController', xbmcWebClientGalleryController);

        xbmcWebClientApp.controller('xbmcWebClientVideoController', xbmcWebClientVideoController);

        xbmcWebClientApp.service('xbmcRemoteService', xbmcRemoteService);

        xbmcWebClientApp.config(['$routeProvider', 'RestangularProvider', function($routeProvider, RestangularProvider) {

            //configure routes to access views
            $routeProvider.when('/gallery', {templateUrl: 'partials/partial1.html', controller: 'xbmcWebClientGalleryController'});
            $routeProvider.when('/videos', {templateUrl: 'partials/partial2.html', controller: 'xbmcWebClientVideoController'});
            $routeProvider.otherwise({redirectTo: '/gallery'});

            RestangularProvider.setBaseUrl('http://raspbmc.mmv.ie:3128');

            // Now let's configure the response extractor for each request
            RestangularProvider.setResponseExtractor(function(response, operation, what, url) {

                return response.result;
            })

        }]);

    return xbmcWebClientApp;
});

