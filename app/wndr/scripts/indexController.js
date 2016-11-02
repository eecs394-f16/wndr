angular
  .module('wndr')
  .controller('indexController', function ($scope, supersonic) {
        
    $scope.markers = [];
    $scope.markerId = 1;
    
    var thoughtBubble = {
        thought: 'your thought here',
        sender: 'nobody',
        lat: 42.051649,
        lng: -87.6772423
    };

    var icons = {
         grinning: {
             url: "/emojis/Grinning_Emoji_with_Smiling_Eyes.png",
             scaledSize: new google.maps.Size(30, 30), // scaled size
             origin: new google.maps.Point(0, 0), // origin
             anchor: new google.maps.Point(0, 0) // anchor
         },
         poop: {
             url: "/emojis/Poop_Emoji.png",
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

    //view initialization
    var init = function () {

        supersonic.device.geolocation.getPosition().then( function(position){
        $scope.position = position;
        $scope.initMap();
      });
    };

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
        
        var marker = addMarker(latlng, icons.poop, $scope.map, google.maps.Animation.DROP);
        marker.addListener('click', function () {
            alert('this is your location!');
        });
        
         firebase.database().ref('/thoughts/').once('value').then(function (snapshot) {
            for (var thought in snapshot.val()) {
                
                var latlng = new google.maps.LatLng(snapshot.val()[thought].lat, snapshot.val()[thought].lng);
                addMarker(latlng, icons.upside_down, $scope.map, google.maps.Animation.DROP);
            }
        });
        //addToFirebase(thoughtBubble);
    };
    google.maps.event.addDomListener(window, 'load', init);

    function addToFirebase(thoughtBubble) {
        var newKey = firebase.database().ref().child('thoughts').push().key;
        var updates = {};
        updates['/thoughts/' + newKey] = thoughtBubble;
        firebase.database().ref().update(updates, function (err) {
            if (err) {
                alert('oh no! the database was not updated!');
            }
        });
    }
    
    function addMarker(latlng, icon, map , animation) {
        
        return new google.maps.Marker({
                            position: latlng,
                            icon: icon,
                            map: map,
                            animation: animation
        });
    }
});
