/**
 * Created by digitalxtasy on 10/1/2015.
 */
var cwlGlobal = {
broadcaster: '',
serverURL: 'rtmp://localhost/videochat/',  //"rtmp://52.90.39.216:1935/videochat"
show: ''
};

var initVideoConfig = function (){
  var $scope = angular.element('#video-swf').scope();
  cwlGlobal.broadcaster = $scope.broadcaster.slug;
  cwlGlobal.show = $scope.broadcaster.status.show;
  cwlGlobal.broadcasterUrl = cwlGlobal.serverURL + cwlGlobal.broadcaster + '/';
  cwlGlobal.streamServer = cwlGlobal.serverURL + cwlGlobal.broadcaster + ((cwlGlobal.show && cwlGlobal.show !== 'public') ? '/' + cwlGlobal.show : '');
  var config = {
    broadcaster:cwlGlobal.broadcaster,
    streamServer: cwlGlobal.streamServer
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

var camStatus = function (status){
  var statusObj = {};

  if(status === 'camDenied'){
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

  var $scope = angular.element('.contain-broadcast').scope();
  $scope.camStatus(statusObj);
  $scope.$apply();
}
