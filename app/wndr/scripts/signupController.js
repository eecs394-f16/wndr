angular
  .module('wndr')
  .controller('signupController', function ($scope, supersonic) {
      supersonic.ui.navigationBar.hide();

      $scope.closesignupview = function () {
          supersonic.ui.layers.pop();
      };

      function errorMsg(errorString) {
        
        var errorDiv = document.getElementById('errorContent');
        errorDiv.innerHTML= errorString;
        document.getElementById('errorMessage').className = '';
        document.getElementById('delete-panel').className='';
      }
      
      $scope.closeAlert = function() {
        
        var errorDiv = document.getElementById('errorMessage');
        document.getElementById('errorContent').innerHTML= '';
        errorDiv.className = 'hidden';
        document.getElementById('delete-panel').className='hidden';
      };
      
      $scope.signUp = function() {
        var username = $scope.username;
        var name = $scope.name;
        var signUpError = false;
        var email = $scope.email;
        var password = $scope.password;
        if ( name === undefined) {
            errorMsg('Please enter your full name');
            return;
        } else if ( username === undefined) {
            errorMsg('Please enter a valid username');
            return;
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            signUpError = true;
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              errorMsg('The password is too weak. Your password needs at least 6 letters.');
            } else {
              errorMsg(errorMessage);
            }
            }).then(function() {
                if (signUpError === false) {
                    errorMsg("You have successfully signed up!");
                    $scope.closesignupview();
                }
            });
        }
      };
  });