angular
  .module('wndr')
  .controller('signupController', function ($scope, supersonic) {
       supersonic.ui.views.current.whenVisible(function() {
        supersonic.ui.navigationBar.hide();
       });

      $scope.closesignupview = function () {
          supersonic.ui.layers.pop();
      };

      function errorMsg(errorString) {
        var options = {
            buttonLabel: "Ok"
          };

          supersonic.ui.dialog.alert(errorString, options).then(function() {
          });
    }

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
            }).then(function(user) {
                if (signUpError === false) {

                    supersonic.data.channel('alert').publish('Congratulations! You have successfully signed up!');
                    user.updateProfile({
                        displayName: username,
                        fullName: name,
                    }).then(function() {
                        // Update successful.
                        localStorage.setItem('email', email);
                        localStorage.setItem('password', password);
                        localStorage.setItem('rememberMe', 'true');
                        $scope.closesignupview();
                      }, function(error) {
                        // An error happened.
                        errorMsg(error.message);
                      });
                }
            });
        }
      };
  });
