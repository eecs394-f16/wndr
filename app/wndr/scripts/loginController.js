angular
  .module('wndr')
  .controller('loginController', function ($scope, supersonic) {
      var provider = new firebase.auth.FacebookAuthProvider();

      $scope.FBLogin = function () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              localStorage.setItem('username', user.displayName.split(" ")[0]);
              localStorage.setItem('userId', user.uid); 
            } else {
                firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                //var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                localStorage.setItem('username', user.displayName.split(" ")[0]);
                localStorage.setItem('userId', user.uid);    
                }).catch(function (error) {
                // Handle Errors here.
                //var errorCode = error.code;
                var errorMessage = error.message;
                supersonic.logger.debug(errorMessage);
                // The email of the user's account used.
                //var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                //var credential = error.credential;
                // ...
                });
            }
        });
        supersonic.ui.initialView.dismiss();
      };
  });