require.config({
    baseUrl: 'js',
    paths: {
        angular: '../bower_components/angular/angular'
        , angularRoute: '../bower_components/angular-route/angular-route'
        , angularMocks: '../bower_components/angular-mocks/angular-mocks'
        , angularBootstrap: '../bower_components/angular-bootstrap/ui-bootstrap-tpls'
        , text: '../bower_components/requirejs-text/text'
        , lodash: '../bower_components/lodash/dist/lodash'
        , restangular: '../bower_components/restangular/dist/restangular'
        , bootstrap: '../bower_components/bootstrap/dist/js/bootstrap'
        , jquery: '../bower_components/jquery/jquery'
        , angularTimer: '../bower_components/angular-timer/dist/angular-timer'
        , angularMoment: '../bower_components/angular-moment/angular-moment'
        , moment: '../bower_components/momentjs/moment'
        , angularMasonry: '../bower_components/angular-masonry/angular-masonry'
        , masonry: '../bower_components/masonry/masonry'
        , imagesloaded: '../bower_components/imagesloaded/imagesloaded'
        , eventie: '../bower_components/eventie'
        , eventEmitter: '../bower_components/eventEmitter'
        , outlayer: '../bower_components/outlayer'
        , 'get-size': '../bower_components/get-size'
        , 'get-style-property': '../bower_components/get-style-property'
        , 'doc-ready': '../bower_components/doc-ready'
        , 'jquery.bridget': '../bower_components/jquery-bridget/jquery.bridget'
        , 'matches-selector': '../bower_components/matches-selector'
    },
    shim: {
        'angular' : {
            exports: 'angular'
        },
        'angularRoute': ['angular'],
        'angularMocks': {
            deps:['angular'],
            exports:'angular.mock'
        },
        'restangular': ['lodash'],
        'angularBootstrap': ['angular'],
        'angularTimer': ['angular'],
        'angularMoment': ['angular'],
        'angularMasonry': ['angular'],
        'bootstrap': ['jquery']
    },
    priority: [
        'angular'
    ]
});

// hey Angular, we're bootstrapping manually!
window.name = 'NG_DEFER_BOOTSTRAP!';

require( [
    'angular',
    'app',
    'jquery'
], function(angular, app, routes) {
    'use strict';
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    angular.element().ready(function() {
        $html.addClass('ng-app');
        angular.bootstrap($html, [app['name']]);
    });
});
