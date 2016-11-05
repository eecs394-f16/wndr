angular
  .module('wndr')
  .controller('newThoughtController', function ($scope, supersonic) {
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
   $scope.getInput = function() {

        document.activeElement.blur();
        supersonic.logger.debug($scope.thought);
        new google.maps.Marker({
                        position: new google.maps.LatLng(42.052649, -87.6772423),
                        icon: $scope.thought,
                        map: $scope.map,
                        animation: google.maps.Animation.DROP
                        });
    };
  });