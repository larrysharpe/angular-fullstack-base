/**
 * Created by digitalxtasy on 10/1/2015.
 */
var getVideoScope = function (){
  var broadcaster = angular.element('#video').scope().broadcaster.slug;
  return broadcaster;
}

function getFlashMovie(movieName) {
  var isIE = navigator.appName.indexOf("Microsoft") != -1;
  return (isIE) ? window[movieName] : document[movieName];
}

function callToActionscript(str)
{
  return getFlashMovie("watch").api(str);
}
