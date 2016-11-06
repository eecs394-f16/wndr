angular
  .module('wndr')
  .controller('newThoughtController', function ($scope, supersonic) {
    
    $scope.iconName = "";
    $scope.selected = undefined;
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
   
   $scope.getInput = function() {

      document.activeElement.blur();
      supersonic.device.geolocation.getPosition().then( function(position){
        $scope.position = position;
      });
      var thoughtBubble = {
        thought: $scope.thought,
        sender: 'Test',
        icon: $scope.iconName,
        lat: $scope.position.coords.latitude,
        lng: $scope.position.coords.longitude
      };
      supersonic.logger.debug($scope.iconName);
      addToFirebase(thoughtBubble);
      supersonic.data.channel('addMarker').publish(thoughtBubble);
      supersonic.ui.tabs.select(0);
    };
    
    $scope.setIcon = function($event, icon) {
      
      if ($scope.selected !== undefined ) {
        $scope.selected.removeClass('selected');
      }
      var el = (function(){
                if ($event.currentTarget.nodeName === 'I') {
                   return angular.element($event.currentTarget).parent(); // get li
                } else {
                   return angular.element($event.currentTarget);          // is li
                }
               })();
      el.addClass('selected');
      $scope.selected = el;
      $scope.iconName = icon;
    };
    
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
  });