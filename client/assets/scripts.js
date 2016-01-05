/**
 * Created by digitalxtasy on 10/1/2015.
 */
var initVideoConfig = function (){
  var $scope = angular.element('#video-swf').scope();
  var config = {
    broadcaster: $scope.broadcaster.slug,
    streamServer: "rtmp://52.90.74.122:1935/videochat"
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
  var $scope = angular.element('.contain-broadcast').scope();
  $scope.camStatus(status);
  $scope.$apply();
}
