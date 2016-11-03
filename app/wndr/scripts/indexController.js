angular
  .module('wndr')
  .controller('indexController', function ($scope, supersonic) {
        
    $scope.markers = [];

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
         },
         OMG: {
             url: "/emojis/OMG_Face_Emoji.png", // url
             scaledSize: new google.maps.Size(30, 30), // scaled size
             origin: new google.maps.Point(0, 0), // origin
             anchor: new google.maps.Point(0, 0) // anchor
         }
     };
     
     var mapIcon = function (iconName) {
        
        switch (iconName) {
            case 'grinning':
                return icons.grinning;
            case 'poop' :
                return icons.poop;
            case 'upside_down':
                return icons.upside_down;
            case 'OMG':
                return icons.OMG;
            default:
                return icons.upside_down;
        }
     };
    //var thoughtBubble = {
    //    thought: 'EECS394 was fun!',
    //    sender: 'Daniel',
    //    lat: 42.051649,
    //    lng: -87.6772423
    //};

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
        
        addMarker(latlng, icons.poop, $scope.map, google.maps.Animation.DROP, 'This is your location!', 'Wndr');
        
        firebase.database().ref('/thoughts/').once('value').then(function (snapshot) {
            for (var thought in snapshot.val()) {
                     
                var latlng = new google.maps.LatLng(snapshot.val()[thought].lat, snapshot.val()[thought].lng);
                addMarker(latlng,
                          mapIcon(snapshot.val()[thought].icon),
                          $scope.map,
                          google.maps.Animation.DROP,snapshot.val()[thought].thought,
                          snapshot.val()[thought].sender);
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
    
    function addMarker(latlng, icon, map , animation, thoughts, sender) {
                      
        var contentString = '<div id="content">'+
                            '<h3>'+sender+'</h3>'+
                            '<p>'+thoughts+
                            '</p>'+
                            '</div>';

                      
        var infowindow = new google.maps.InfoWindow({
                           content: contentString
                          });
        var result = new google.maps.Marker({
                        position: latlng,
                        icon: icon,
                        map: map,
                        animation: animation
                        }).addListener('click', function () {
                          infowindow.open(map,this);
                        });
        $scope.markers.push(result);
        return result;
    }
});
