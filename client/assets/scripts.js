/**
 * Created by digitalxtasy on 10/1/2015.
 */

var swfConfig;

var initVideoConfig = function (){
  var $scope = angular.element('#video-swf').scope();
   swfConfig = {
    broadcaster: $scope.broadcaster.slug,
    server: {
      dev: 'rtmp://localhost/videochat/',
      prod: 'rtmp://52.90.39.216:1935/videochat'
    },
    env: 'dev',
    show: $scope.broadcaster.status.show
  };
  return config;
}

function getFlashMovie(movieName) {
  var isIE = navigator.appName.indexOf("Microsoft") != -1;
  return (isIE) ? window[movieName] : document[movieName];
}

function callToActionscript(input){
  return getFlashMovie("video-swf").api(input);
}

var watchTest = function (input){
  console.log('watchTest', input);
};

var streamPlaying = function () {
  var $scope = angular.element('.contain-watch').scope();
  $scope.startTimer();
};

var streamNotPlaying = function (){
  var $scope = angular.element('.contain-watch').scope();
  $scope.stopTimer();
}

var camStatus = function (status){
  var statusObj = {};
  var $scope = angular.element('.contain-broadcast').scope();

  if(status === 'inherit') {
    statusObj.show = $scope.broadcaster.status.show;
  } else if(status === 'camDenied'){
    statusObj.show = 'offline';
    statusObj.msg = 'You have denied access to your camera.';
  } else if(status === 'connectionFailed'){
    statusObj.show = 'offline';
    statusObj.msg = 'Sorry we could not connect to the server. Please try again later.';
  } else if(status === 'connectionRejected'){
    statusObj.show = 'offline';
    statusObj.msg = 'Connection rejected by the server. Please try again later.';
  } else {
    statusObj.show = status;
  }

  $scope.camStatus(statusObj);
  $scope.$apply();
}
