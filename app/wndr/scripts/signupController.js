angular
  .module('wndr')
  .controller('signupController', function ($scope, supersonic) {
      supersonic.ui.navigationBar.hide();

      $scope.closesignupview = function () {
          supersonic.ui.layers.pop();
      }
  });