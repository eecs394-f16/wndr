angular
  .module('wndr')
  .controller('indexController', function ($scope, supersonic) {

      var thoughtBubble = {
          thought: 'your thought here',
          sender: 'nobody',
          lat: 42.051649,
          lng: -87.6772423
      }

      var icons = {
          poop: {
              url: "emojis/Poop_Emoji.png",
              scaledSize: new google.maps.Size(30, 30), // scaled size
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(0, 0) // anchor
          },
          upside_down: {
              url: "/emojis/Upside-Down_Face_Emoji.png", // url
              scaledSize: new google.maps.Size(30, 30), // scaled size
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(0, 0) // anchor
          }
      }
      var happyIcon = {
          url: "/emojis/Upside-Down_Face_Emoji.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      };

    newListingBtn = new supersonic.ui.NavigationBarButton({
      onTap: function() {

        var view = new supersonic.ui.View("wndr#newThought");
        supersonic.ui.layers.push(view);
      },
      styleId: "nav-newThought"
    });

    supersonic.ui.navigationBar.update({
      title: "wndr",
      overrideBackButton: false,
      buttons: {
        right: [newListingBtn]
      }
    }).then(supersonic.ui.navigationBar.show());

    var init = function () {

        supersonic.device.geolocation.getPosition().then( function(position){
        $scope.position = position;
        $scope.initMap();
      });
    };

    $scope.markers = [];
    $scope.markerId = 1;

    //Map initialization
    $scope.initMap = function() {
        document.getElementById('map_canvas').style.height = window.innerHeight + "px";
        var latlng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);
        
        var myOptions = {
            zoomControl: false,
            mapTypeControl: false,
            zoom: 17,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        var marker = new google.maps.Marker({
                            position: latlng,
                            icon: icons['upside_down'],
                            map: $scope.map,
                            animation: google.maps.Animation.DROP
        });
        firebase.database().ref('/thoughts/').once('value').then(function (snapshot) {
            for (var thought in snapshot.val()) {
                supersonic.logger.log(snapshot.val()[thought]);
                var latlng = new google.maps.LatLng(snapshot.val()[thought]['lat'], snapshot.val()[thought]['lng']);
                var marker = new google.maps.Marker({
                    position: latlng,
                    icon: icons['upside_down'],
                    map: $scope.map,
                    animation: google.maps.Animation.DROP
                });
            }
        });
        addToFirebase(thoughtBubble);
    };
    google.maps.event.addDomListener(window, 'load', init);

    function addToFirebase(thoughtBubble) {
        var newKey = firebase.database().ref().child('thoughts').push().key;
        var updates = {}
        updates['/thoughts/' + newKey] = thoughtBubble;
        firebase.database().ref().update(updates, function (err) {
            if (err) {
                alert('oh no! the database was not updated!');
            }
        });
    }
    });
