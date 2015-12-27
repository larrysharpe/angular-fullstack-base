angular.module('baseApp')
  .controller('BalanceCtrl', function ($scope, User, Auth, $http) {

    $scope.purchase = {
      amount: 500,
      perToken: .10,
      total: 50,
      purchaseAmounts: [
        {amount: 100, perToken: .10},
        {amount: 200, perToken: .10},
        {amount: 300, perToken: .10},
        {amount: 400, perToken: .10},
        {amount: 500, perToken: .10},
        {amount: 600, perToken: .10},
        {amount: 700, perToken: .10},
        {amount: 800, perToken: .10},
        {amount: 900, perToken: .10},
        {amount: 1000, perToken:.08},
        {amount: 1100, perToken: .08},
        {amount: 1500, perToken: .08}
      ],
      update: function () {
        for(i = 0; i < $scope.purchase.purchaseAmounts.length; i++){
          if (Number($scope.purchase.amount) === $scope.purchase.purchaseAmounts[i].amount){
            $scope.purchase.perToken = $scope.purchase.purchaseAmounts[i].perToken;
            $scope.purchase.total = $scope.purchase.purchaseAmounts[i].perToken * $scope.purchase.purchaseAmounts[i].amount;
            break;
          }
        }
      }
    }

    $scope.buyTokens = function () {
      var obj = {
        slug: $scope.user.slug,
        units: $scope.purchase.amount
      };
      $http.post('/api/users/buyTokens', obj)
        .success(function(data){
          $scope.user.credits.units = data.credits.units;
        })
    }

    $scope.user = Auth.getCurrentUser();
    $http.get('/api/users/'+$scope.user._id+'/faves')
      .success(function(data){
        $scope.faves = data;
      })

  });
