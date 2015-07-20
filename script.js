var app = angular.module("app", []);
 
function RemoteResource($http,baseUrl) {
  this.get=function(fnOK,fnError) {
        $http({
          method: 'GET', 
          url: baseUrl+'/DB/datos.json'
        }).success(function(data, status, headers, config) {
            fnOK(data);
        }).error(function(data, status, headers, config) {
            fnError(data,status);
        });
      }
}
 
function RemoteResourceProvider() {
  var _baseUrl;
  this.setBaseUrl=function(baseUrl) {
    _baseUrl=baseUrl;
  }
  this.$get=['$http',function($http) {
    return new RemoteResource($http,_baseUrl);
  }];
}
 
app.provider("remoteResource",RemoteResourceProvider);
 
app.constant("baseUrl", ".");
app.config(['baseUrl', 'remoteResourceProvider',function(baseUrl, remoteResourceProvider) {
    remoteResourceProvider.setBaseUrl(baseUrl);
}]);
 
app.controller("SeguroController", ['$scope', 'remoteResource',function($scope, remoteResource) {
    $scope.seguro = {
      nif: "",
      nombre: "",
      ape1: "",
      edad: undefined,
      sexo: "",
      casado: false,
      numHijos: undefined,
      embarazada: false,
      coberturas: {
        oftalmologia: false,
        dental: false,
        fecundacionInVitro: false
      },
      enfermedades: {
        corazon: false,
        estomacal: false,
        rinyones: false,
        alergia: false,
        nombreAlergia: ""
      },
      fechaCreacion: new Date()
    }
 
    remoteResource.get(function(seguro) {
      $scope.seguro = seguro;
    }, function(data, status) {
      alert("Ha fallado la petición. Estado HTTP:" + status);
    });
 
  }
]);
