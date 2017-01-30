angular
  .module('wndr')
  .controller('loginController', function ($scope, supersonic) {
    supersonic.ui.navigationBar.hide();


    supersonic.ui.views.current.whenVisible( function() {
      if(localStorage.getItem('rememberMe') == 'true'){
        document.getElementById('LoginEmail').value = localStorage.getItem('email');
        document.getElementById('LoginPassword').value = localStorage.getItem('password');
        document.getElementById('RememberMe').checked = true;
      }





    });




      var signupView = new supersonic.ui.View("wndr#signup");
      var fadeAnimation = supersonic.ui.animate("fade");

      $scope.loadsignupview = function () {
          supersonic.ui.layers.push(signupView, { animation: fadeAnimation});
      };

      $scope.FBLogin = function () {
          var email = document.getElementById('LoginEmail').value;
          var password = document.getElementById('LoginPassword').value;
          firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
              localStorage.setItem('email', result.email);
              localStorage.setItem('userId', result.uid);
              localStorage.setItem('username', result.displayName);
              localStorage.setItem('rememberMe', document.getElementById('RememberMe').checked);
              if(localStorage.getItem('rememberMe') == 'true'){
                localStorage.setItem('password',password);
              }
              else if (localStorage.getItem('password') === null) {
                document.getElementById('LoginEmail').value = '';
                document.getElementById('LoginPassword').value = '';
                document.getElementById('RememberMe').checked =false;
              }
              else{
                localStorage.removeItem('password');
                document.getElementById('LoginEmail').value = '';
                document.getElementById('LoginPassword').value = '';
                document.getElementById('RememberMe').checked =false;
              }
              supersonic.ui.layers.replace('index');
          }).catch(function (error) {
              var errorMessage = error.message;
              errorMsg(errorMessage);
          });
    };


    function errorMsg(errorString) {
        var options = {
            buttonLabel: "Ok"
          };

          supersonic.ui.dialog.alert(errorString, options).then(function() {
          });
    }

    supersonic.data.channel('alert').subscribe( function(message) {
        errorMsg(message);
    });
  });
