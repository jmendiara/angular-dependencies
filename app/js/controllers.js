'use strict';

/* Controllers */


var providers = {};
angular.module('ng')
    .config(['$provide', function ($provide){
      providers = $provide.getProviders();
    }]);


function CoreController($scope) {

  $scope.nodes = [];
  angular.forEach(providers, function (provider, providerName){
    providerName = providerName.replace('Provider', '');
    if (providerName === '$injector'  || providerName === '$provide'  ) return;
      $scope.nodes.push(providerName);
  });

  var injector = angular.injector(['ng']);

  $scope.edges = [];
  angular.forEach(providers, function (provider, i){
    if (!provider.$get) return;
    var injected = injector.annotate(provider.$get);
    $scope.edges = $scope.edges.concat(createEdges(i, injected));
  });


  function createEdges(provider, dest){
    var ret = [],
        provider = provider.replace('Provider', '');

    angular.forEach(dest, function (edge){
      if (edge === '$injector'  || edge === '$provide'  ) return;
      if (!providers[edge+"Provider"]){
        console.log("aaaaaaaaaaaaaato", edge);
        return;
      }
      ret.push ({src: provider, dst: edge});
    });

    return ret;
  }
}

CoreController.$inject = ['$scope'];
