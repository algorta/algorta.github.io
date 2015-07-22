var gifwalletApp = angular.module('gifwalletApp', ['ui.bootstrap', 'ngRoute']);

gifwalletApp.controller('GifListController', ['$rootScope', '$scope', 'Storage',
    function($rootScope, $scope, Storage) {
        $scope.giflist = Storage.list();

        $rootScope.$on('reloadList', function(event, data) {
            $scope.giflist = Storage.list();
        });
    }
]);

gifwalletApp.controller('MenuController', ['$rootScope', '$scope', 'Storage', '$modal',
    function($rootScope, $scope, Storage, $modal) {

        $scope.add = function() {
            $modal.open({
                templateUrl: 'add_gif.html',
                controller: function($scope, $modalInstance) {
                    $scope.Gif = {};

                    $scope.save = function() {
                        var image = {
                            'name': $scope.Gif.name,
                            'url': $scope.Gif.url,
                            'tags': [],
                            'favorite': false
                        };
                        Storage.save(image);
                        
                        $rootScope.$broadcast('reloadList');
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });
        };

    }
]);

gifwalletApp.service('Storage', ['$window', '$rootScope',
    function($window, $rootScope) {
        var images = [];

        if (!$window.localStorage) {
            alert('No tienes localStorage activado');
        } else {
            images = $window.localStorage.getItem('gifWallet');
            images = angular.fromJson(images);
        }

        this.save = function(image) {
            if (images == null) {
                images = [];
            } else {
                images = angular.fromJson(images);
            }
            images.push(image);
            imagesString = JSON.stringify(images);
            $window.localStorage.setItem('gifWallet', imagesString);
        }

        this.remove = function(key) {

        }

        this.list = function() {
            return angular.fromJson($window.localStorage.getItem('gifWallet')).reverse();
        }

        this.get = function(key) {
            return images[key];
        }

        this.favorite = function(key) {
            images = images.reverse();
            images[key].favorite = (images[key].favorite) ? false : true;
            images = images.reverse();
            imagesString = JSON.stringify(images);
            $window.localStorage.setItem('gifWallet', imagesString);
            $rootScope.$broadcast('reloadList');
        }
    }
]);

gifwalletApp.directive('favorite', ['Storage', '$compile',
    function (Storage, $compile) {
        return {
            restrict: 'E',
            replace: true,
            link: function(scope, elem, attrs) {
                html = '<a ng-click="favItem('+attrs.key+')"><span class="glyphicon" ng-class="getClass('+attrs.key+')"></span> Favorito</a>';
                
                scope.favItem = function(key) {
                    Storage.favorite( key );
                };

                scope.getClass = function(key) {
                    return (scope.giflist[key].favorite) ? 'glyphicon-heart' : 'glyphicon-heart-empty';
                };
                
                elem.replaceWith($compile(html)(scope));
            },
            scope: true
        }
    }   
]);
