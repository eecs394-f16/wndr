angular
  .module('wndr')
  .controller('indexController', function($scope, supersonic) {
    
    var init = function () {
      
        supersonic.device.geolocation.getPosition().then( function(position){
        $scope.position = position;
        supersonic.logger.debug (position);
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
            zoom: 17,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        var happyIcon = {
            url: "http://www.freeiconspng.com/uploads/emoji-png-9.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        var marker = new google.maps.Marker({
            
                            position: latlng,
                            icon: happyIcon,
                            map: $scope.map,
                            animation: google.maps.Animation.DROP
                      });
    };
    google.maps.event.addDomListener(window, 'load', init);
    });