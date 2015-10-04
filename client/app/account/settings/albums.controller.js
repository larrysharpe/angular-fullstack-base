angular.module('baseApp')
  .controller('AlbumsCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};
    $scope.createAlbumForm = false;
    $scope.openCreateAlbumForm = function (){
      $scope.createAlbumForm = true;
    };
    $scope.closeCreateAlbumForm = function (){
      $scope.createAlbumForm = false;
    };
    $scope.user = Auth.getCurrentUser();
    if(!$scope.user.albums) $scope.user.albums = [];

    $scope.newAlbum = {
      name: 'Untitled Album'
    }

    $scope.createAlbum = function (){
      var album = {
        name: $scope.newAlbum.name,
        pics: []
      };

      $scope.user.albums.push(album);
      $scope.newAlbum.name = 'Untitled Album';
      $scope.closeCreateAlbumForm();
    }

    $scope.deleteAlbum = function (index){
      $scope.user.albums.splice(index,1);
    };

    $scope.showUploadForm = function (index){
      $scope.user.albums[index].showUploadForm = true;
    };

    $scope.hideUploadForm = function (index){
      $scope.user.albums[index].showUploadForm = false;
    };

  });
