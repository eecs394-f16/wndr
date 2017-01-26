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
      firebase.auth().signInWithEmailAndPassword(email,password).then(function (result) {
      localStorage.setItem('email', result.email);
      localStorage.setItem('userId', result.uid);
      localStorage.setItem('username', result.displayName);
              
      supersonic.ui.initialView.dismiss();
      }).catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
      });
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
      
    supersonic.data.channel('alert').subscribe( function(message) {
        errorMsg(message);
    });
        /*
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
