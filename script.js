var app=angular.module("app",[]);
  
function PruebaController($scope) {
  $scope.mensaje="Hola Mundo";
   
  $scope.cambiarMensaje=function() {
    $scope.mensaje="Adios mundo cruel :-)";
  }
   
}