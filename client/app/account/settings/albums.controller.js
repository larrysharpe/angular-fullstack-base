angular.module('baseApp')
  .controller('AlbumsCtrl', function ($scope, User, Auth, $http, socket, socketInit) {
    //// $scope Declarations
    $scope.albumForm = false;
    $scope.errors = {};
    $scope.newAlbum = {};
    $scope.user = Auth.getCurrentUser();

    //// Event handler functions
    var initReturn = function (initObj){
      console.log('init return: ',initObj);
    };

    var handleGetGalleries = function (res) {
      console.log(res);

      if(res.error){
        console.log('Galleries not loaded. Error:', res.errorInfo);
      } else {
        $scope.user.albums = res.results;
      }
    };

    socketInit.run(initReturn, $scope.user);
    socket.emit('galleriesGetByOwner', $scope.user.slug, handleGetGalleries);


    var resetAlbum = function () {
      $scope.newAlbum = {
        active: true,
        description: '',
        name: 'Untitled Album'
      }
    }

    resetAlbum();


    $scope.openCreateAlbumForm = function (){
      $scope.albumForm = true;
    };
    $scope.closeCreateAlbumForm = function (){
      $scope.albumForm = false;
    };

    $scope.editAlbum = function (index) {
      $scope.albumForm = true;
      $scope.newAlbum = $scope.user.albums[index];
    }


    $scope.user = Auth.getCurrentUser();
    if(!$scope.user.albums) $scope.user.albums = [];



    var handleSaveGallery = function (res){
      console.log(res);

      if(res.error){
        console.log('Gallery not saved. Error:', res.errorInfo);
      } else {
        $scope.user.albums.push(res.results);
        resetAlbum();
        $scope.closeCreateAlbumForm();
      }
    }


    var handleDeleteGallery = function (res){

      console.log(res);

      if(res.error){
        console.log('Gallery not deleted. Error:', res.errorInfo);
      } else {
        console.log('gallery deleted')

        for(var i = 0; i < $scope.user.albums.length; i++){
          if ($scope.user.albums[i]._id === res.results._id ){
            $scope.user.albums.splice(i,1);
          }
        }

      }
    }

    var handleUpdateGallery = function (res){

      if(res.error){
        console.log('Gallery not updates. Error:', res.errorInfo);
      } else {
        console.log('gallery update')

        for(var i = 0; i < $scope.user.albums.length; i++){
          if ($scope.user.albums[i]._id === res.results._id ){
            $scope.user.albums[i] = res.results;
            resetAlbum();
            $scope.closeCreateAlbumForm();
            break;
          }
        }

      }

    };

    $scope.createAlbum = function (){
      $scope.newAlbum.owner = $scope.user.slug;

      var cb = ($scope.newAlbum._id) ? handleUpdateGallery : handleSaveGallery;

      socket.emit('saveGallery', $scope.newAlbum, cb);
    }

    $scope.deleteAlbum = function (id){
      socket.emit('deleteGalleries', id, handleDeleteGallery);
    };

    $scope.renameAlbum = function (index) {
      $scope.user.albums[index].name = this.newAlbumName;
      $scope.hideRenameForm(index);
    };

    $scope.showUploadForm = function (index){
      $scope.user.albums[index].showUploadForm = true;
    };

    $scope.hideUploadForm = function (index){
      $scope.user.albums[index].showUploadForm = false;
    };

    $scope.showRenameForm = function (index){
      $scope.user.albums[index].showRenameForm = true;
    };

    $scope.hideRenameForm = function (index){
      $scope.user.albums[index].showRenameForm = false;
    };

  });
