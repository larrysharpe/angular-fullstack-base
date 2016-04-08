'use strict';

angular.module('baseApp')
  .directive('videoChatBroadcast', function () {
    return {
      templateUrl: 'components/videoChatBroadcast/videoChatBroadcast.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: function ($scope, socket){

        var showRequestRcv = function (data) {

          console.log('showReqRcv:', data);

          for (var i = 0; i < data.length; i++){
            $scope.requests.push(data[i]);
          }
        };

        var onSetStatus = function (data){
          console.log('onSetStatus Return', data);
          $scope.broadcaster.status = data.user.status;
        }


        $scope.isInShow = function () {
          var shows = ['public', 'private', 'password', 'meter', 'goal'];
          if ($scope.broadcaster && $scope.broadcaster.status && $scope.broadcaster.status.show){
            return shows.indexOf($scope.broadcaster.status.show) > -1;;
          } else {
            return false;
          }
        }


        var handleShowStart = function (data){
          if(data.status === 'error'){

          } else {
            $scope.show = data.show;
            $scope.broadcaster.status = data.user.status;
            $scope.closePasswordControls();
            $scope.closeGoalControls();
            $scope.closeMeterControls();
          }
        }

        $scope.startShow = function (show){

          var obj = {
            broadcaster: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            requestor: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            show: show
          }

          socket.emit('showStart', obj, handleShowStart);
        }

        var handleShowStop = function (data) {
          if (data.status === 'success') {
            $scope.broadcaster.status = data.user.status;
          }
        }

        $scope.stopShow = function (){

          socket.emit('showStop', $scope.show, handleShowStop);

        }

        $scope.isAvailability = function (availability) {
          if($scope.broadcaster && $scope.broadcaster.status && $scope.broadcaster.status.availability){
            return $scope.broadcaster.status.availability === availability;
          }
        };

        $scope.setAvailability = function (availability){

          var ava = $scope.broadcaster.status;
          ava.availability = availability;

          var data = {
            slug: $scope.broadcaster.slug,
            status: ava
          };

          console.log('set ava: ', data)
          socket.emit('status:change', data, onSetStatus);
        };

        var clearRequests = function (){
          $scope.requests = [];
        }

        var acceptShowCB = function (data) {
          if (data.status == 'success'){
            clearRequests();
            $scope.changePublish(data.user);
          }
        }

        $scope.acceptShow = function (index) {
          socket.emit('show:requestAccepted:send',$scope.requests[index], acceptShowCB);
        }

        $scope.closePasswordControls = function () {
          $scope.openPasswordShowControls = false;
        };

        $scope.openPasswordControls = function () {
          $scope.openPasswordShowControls = true;
        };

        $scope.startPasswordShow = function (){
          var obj = {
            broadcaster: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            requestor: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            show: 'password',
            password: $scope.passwordShow.password

          }
          socket.emit('showStart', obj, handleShowStart);
        }

        $scope.closeGoalControls = function () {
          $scope.openGoalShowControls = false;
        };

        $scope.openGoalControls = function () {
          $scope.openGoalShowControls = true;
        };

        $scope.goalShow = {
          goal: null,
          min: null
        };

        $scope.goalShowReady = function () {
          return $scope.goalShow.goal && $scope.goalShow.min;
        }

        $scope.startGoalShow = function (){
          var obj = {
            broadcaster: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            requestor: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            show: 'goal',
            goal: $scope.goalShow.goal,
            goalMin: $scope.goalShow.min

          }
          socket.emit('showStart', obj, handleShowStart);
        }

        $scope.closeMeterControls = function () {
          $scope.openMeterShowControls = false;
        };

        $scope.openMeterControls = function () {
          $scope.openMeterShowControls = true;
        };

        $scope.meterShow = {
          speed: null,
          milestones: []
        }

        $scope.meterShowReady = function () {
          return $scope.meterShow.speed && $scope.meterShow.milestones.length;
        }

        $scope.removeMilestone = function (index){
          $scope.meterShow.milestones.splice(index, 1);
        }

        $scope.addMilestone = function (){
          $scope.meterShow.milestones.push({});
        }

        $scope.startMeterShow = function (){
          var obj = {
            broadcaster: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            requestor: {
              slug: $scope.broadcaster.slug,
              name: $scope.broadcaster.username
            },
            show: 'meter',
            milestones: $scope.meterShow.milestones,
            speed: $scope.meterShow.speed
          }
          socket.emit('showStart', obj, handleShowStart);
        }

        socket.on('show:request:rcv', showRequestRcv);
        $scope.requests = [];

      }
    };
  });
