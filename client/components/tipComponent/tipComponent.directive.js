'use strict';

angular.module('baseApp')
  .directive('tipComponent', function () {
    return {
      templateUrl: 'components/tipComponent/tipComponent.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, $http, socket){
        $scope.tipAmounts = [1, 5, 10, 25, 50, 100];
        $scope.open = false;
        $scope.hideTip = false;

        $scope.sendTip = function (amt, rain) {
          var tip = {
            from: $scope.user.slug,
            to: $scope.broadcaster.slug,
            amount: amt,
            rain: rain || false,
            hideTip: $scope.hideTip,
            tipNote: $scope.tipNote
          };

          socket.emit('send-tip', tip, function(user){
            $scope.user = user;
          });
        };

        $scope.openTips = function () {
          $scope.open = true;
        };

        $scope.closeTips = function () {
          $scope.open = false;
        };
      }
    };
  });
