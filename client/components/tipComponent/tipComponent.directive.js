'use strict';

angular.module('baseApp')
  .directive('tipComponent', function () {
    return {
      templateUrl: 'components/tipComponent/tipComponent.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, $http, socket, ngAudio){
        var errorSound = ngAudio.load('/assets/sounds/error.wav');

        $scope.tipAmounts = [1, 5, 10, 25, 50, 100];
        $scope.tipsOpen = false;
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

          if ($scope.tipAmounts.indexOf(amt) == -1) {
              var found = false;

              if($scope.tipAmounts[0] > amt){
                $scope.tipAmounts.unshift(amt);
                $scope.tipAmounts.pop();
              }
              else if($scope.tipAmounts[$scope.tipAmounts.length -1] < amt) {
                $scope.tipAmounts.push(amt);
                $scope.tipAmounts.shift();
              } else {
                for (var i = 0; i < $scope.tipAmounts.length; i++) {
                  if ($scope.tipAmounts[i] > amt) {
                    $scope.tipAmounts.splice(i, 0, amt);
                    $scope.tipAmounts.shift();
                    break;
                  }
                }
              }
          }


          socket.emit('tip:send', tip, function(user){
            if(user.error && user.errorCode === 101) {
              errorSound.play();
              console.log('Error Returned: ',user);
            }
            else $scope.user = user;
          });
        };

        $scope.toggleTips = function () {
          $scope.tipsOpen = !$scope.tipsOpen;
        };

        $scope.closeTips = function () {
          $scope.tipsOpen = false;
        };
      }
    };
  });
