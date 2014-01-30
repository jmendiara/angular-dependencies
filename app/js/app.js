'use strict';


// Declare app level module which depends on filters, and services
angular.module('ngDeps', ['ngCookies', 'ngRoute', 'ngSanitize', 'ngDeps.services', 'ngDeps.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/core', {templateUrl: 'partials/core.html', controller: CoreController});
    $routeProvider.otherwise({redirectTo: '/core'});
  }]);
