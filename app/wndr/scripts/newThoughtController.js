angular
  .module('wndr')
  .controller('newThoughtController', function ($scope, supersonic) {
    
    function init() {
      $scope.iconName = "";
      $scope.selected = undefined;
      $scope.thought = "";
    }
        
    supersonic.ui.views.current.whenVisible(function(){
      init();
    });
    
    $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      element.style.height =  scrollHeight + "px";    
   };
   
   $scope.getInput = function() {

      document.activeElement.blur();
      if ($scope.iconName === "") {
        supersonic.ui.dialog.alert("Please select an Icon!");
        return;
      }
      if ($scope.thought === "") {
        supersonic.ui.dialog.alert("Please input some text for a wndr!");
        return;
      }
      $scope.selected.removeClass('selected');
      supersonic.device.geolocation.getPosition().then( function(position){
        $scope.position = position;
        var thoughtBubble = {
        thought: $scope.thought,
        sender: localStorage.getItem('username'),
        icon: $scope.iconName,
        lat: $scope.position.coords.latitude,
        lng: $scope.position.coords.longitude,
        likes: 0
        };
        thoughtBubble = addToFirebase(thoughtBubble);
        supersonic.data.channel('addMarker').publish(thoughtBubble);
        init();
        supersonic.ui.tabs.select(0);
      });
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
    thoughtBubble.key = newKey;
    firebase.database().ref().update(updates, function (err) {
        if (err) {
            alert('oh no! the database was not updated!');
        }
    });
    return thoughtBubble;
    }
    
    $scope.updateChar = function() {
    
    var characters = $scope.thought.length;
    //var words = this.value.split(' ').length;
    document.getElementById('characters').innerHTML = 200 - characters;
    //document.getElementById('words').value = words;
    };
  });