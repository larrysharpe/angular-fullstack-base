/**
 * Created by digitalxtasy on 10/1/2015.
 */
var initVideoConfig = function (){
  var $scope = angular.element('#video-swf').scope();
  var config = {
    broadcaster: $scope.broadcaster.slug,
    streamServer: 'rtmp://localhost/videochat/'
    //streamServer: "rtmp://52.90.39.216:1935/videochat" //prod
  };
  return config;
}

function getFlashMovie(movieName) {
  var isIE = navigator.appName.indexOf("Microsoft") != -1;
  return (isIE) ? window[movieName] : document[movieName];
}

function callToActionscript(str){
  return getFlashMovie("video-swf").api(str);
}

var camStatus = function (status){
  var statusObj = {};

  if(status === 'camDenied'){
    statusObj.show = 'offline';
  } else {
    statusObj.show = status;
  }
  statusObj.online = 'online';

  var $scope = angular.element('.contain-broadcast').scope();
  $scope.camStatus(statusObj);
  $scope.$apply();
}
