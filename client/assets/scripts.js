/**
 * Created by digitalxtasy on 10/1/2015.
 */
var initVideoScope = function (){
  console.log('initVideoScope');
  var $scope = angular.element('#video-swf').scope(),
      broadcaster = $scope.broadcaster.slug;
  console.log('ivs: ');
  console.log(broadcaster);
  return broadcaster;
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
