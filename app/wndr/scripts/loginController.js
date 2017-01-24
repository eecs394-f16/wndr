angular
  .module('wndr')
  .controller('loginController', function ($scope, supersonic) {

      var view = new supersonic.ui.View("wndr#signup");

      $scope.loadsignupview = function () {
          var fadeAnimation = supersonic.ui.animate("fade");
          supersonic.ui.layers.push(view, { animation: fadeAnimation });
      };


        $scope.FBLogin = function () {
          var email = document.getElementById('LoginEmail').value;
          var password = document.getElementById('LoginPassword').value;
          supersonic.logger.debug('here');
          firebase.auth().signInWithEmailAndPassword(email,password).then(function (result) {
          localStorage.setItem('email', result.email);
          localStorage.setItem('userId', result.uid);
          supersonic.ui.initialView.dismiss();
          }).catch(function (error) {
            var errorMessage = error.message;
            alert(errorMessage);
          });
        };/*
        localStorage.setItem('email',email);
        if(document.getElementById("RememberMe").checked){
          localStorage.setItem('RememberMe','True');
          localStorage.setItem('password',password);
        }
        else{
          localStorage.removeItem('RememberMe');
          supersonic.ui.dialog.alert("Please select an Icon!"+email+password);
        }


        supersonic.ui.initialView.dismiss();
      }; */
  });
