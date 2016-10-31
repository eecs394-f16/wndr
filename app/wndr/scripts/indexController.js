angular
  .module('wndr')
  .controller('indexController', function($scope, supersonic, $timeout) {
    
    supersonic.device.geolocation.getPosition().then( function(position){
        $scope.position = position;
        supersonic.logger.debug (position);
        $scope.initMap();
    });
    
    $scope.markers = [];
    $scope.markerId = 1;

    //Map initialization  
    $scope.initMap = function() {
        
        var latlng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        var marker = new google.maps.Marker({
            
                            position: latlng,
                            map: $scope.map,
                            animation: google.maps.Animation.BOUNCE
                      });
    };
    
    });