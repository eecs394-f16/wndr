angular
  .module('wndr')
  .controller('indexController', function (icons, $interval, $scope, supersonic, $compile,$window) {

    $scope.markers = [];
    $scope.currentPosition = undefined;
    $scope.commentInput = "";

     var mapIcon = function (iconName) {

        switch (iconName) {
          case 'heart' :
            return icons.heart;
          case 'angry':
            return icons.angry;
          case'sad' :
            return icons.sad;
          case 'tongueOut' :
            return icons.tongueOut;
          case 'happyTears' :
            return icons.happyTears;
          case 'thinking' :
            return icons.thinking;
          case 'smiling':
            return icons.smiling;
          case 'grinning':
              return icons.grinning;
          case 'poop' :
              return icons.poop;
          case 'upside_down':
              return icons.upside_down;
          case 'OMG':
              return icons.OMG;
          case 'unamused':
              return icons.unamused;
          case 'red_flag':
              return icons.red_flag;
          default:
              return icons.upside_down;
        }
     };

    supersonic.ui.navigationBar.update({
      title: "wndr",
      overrideBackButton: false,
      //buttons: {
      //  right: [newListingBtn]
      //}
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

        $scope.ib = new google.maps.InfoWindow();
        document.getElementById('map_canvas').style.height = window.innerHeight + "px";
        var latlng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);

        var myOptions = {
            zoomControl: false,
            mapTypeControl: false,
            zoom: 18,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.map.addListener('click', function() {
          $scope.ib.close();
        });
        $scope.currentPosition = addMarker(latlng, icons.red_flag, $scope.map, google.maps.Animation.DROP, 'This is your location!', 'Wndr',-1);

        firebase.database().ref('/thoughts/').once('value').then(function (snapshot) {
            for (var thought in snapshot.val()) {

                var latlng = new google.maps.LatLng(snapshot.val()[thought].lat, snapshot.val()[thought].lng);
                var likes = 0;
                if (snapshot.val()[thought].likes) {
                  
                  likes = snapshot.val()[thought].likes;
                }
                addMarker(latlng,
                          mapIcon(snapshot.val()[thought].icon),
                          $scope.map,
                          google.maps.Animation.DROP,
                          snapshot.val()[thought].thought,
                          snapshot.val()[thought].sender,
                          snapshot.val()[thought].likers,
                          thought,
                          likes);
            }
        });
    };
    google.maps.event.addDomListener(window, 'load', init);

    function showComments(key){
      var ref = "/thoughts/" + key +"/comments/";
       firebase.database().ref(ref).once('value').then(function (snapshot) {
          var commentElement = document.getElementById('comments');
          var html = "";
            for (var comment in snapshot.val()) {
                html = html + '<div class="comment">'+snapshot.val()[comment].text+'</div>';
            }
          commentElement.innerHTML = html;
        });
    }

    $scope.addComment = function (key){
      var input = angular.element(document.getElementById('newComment'));
      if (input.hasClass('hidden')) {
          input.removeClass('hidden');
      } else {
          $scope.submitComment(key);
      }
      input.addClass("comment");
      showComments(key);
      var element = $window.document.getElementById('newComment');
        if(element)
          element.focus();

    };

    $scope.submitComment = function (key){
      document.activeElement.blur();
      var commentElement = document.getElementById('comments');
      commentElement.innerHTML = commentElement.innerHTML + '<div class="comment">'+$scope.commentInput+'</div>';
      postComment($scope.commentInput, key);
      $scope.commentInput = "";
    };

    function postComment(inputText, key) {
      var input = {
        text: inputText
      };
      var ref = "/thoughts/" + key +"/comments/";
      var newKey = firebase.database().ref(ref).push().key;
      var updates = {};
      updates[ref + newKey] = input;
      firebase.database().ref().update(updates, function (err) {
          if (err) {
              alert('oh no! the database was not updated!');
          }
      });
    }
    
    $scope.addLike = function (key) {
      
      var like = document.getElementById('likes');
      var icon = angular.element(document.getElementById('likeIcon'));
      var ref = "/thoughts/" + key +"/likes";
      var likers = "/thoughts/" + key +"/likers/";
      var likes = parseInt(like.innerHTML);
      var likerKey = icon.attr('data');
            supersonic.logger.debug('here');

      var updates = {};
      supersonic.logger.debug('here');
      supersonic.logger.debug(likerKey);

      if (icon.hasClass('fa-heart')) {
        
        likes = likes - 1;
        like.innerHTML = likes;
        icon.removeClass('fa-heart');
        icon.addClass('fa-heart-o');
        supersonic.logger.debug(likers+likerKey);
        firebase.database().ref(likers+likerKey).remove();
      } else{
        
        likes = likes + 1;
        like.innerHTML = likes;
        icon.removeClass('fa-heart-o');
        icon.addClass('fa-heart');
        
        var newKey = firebase.database().ref(likers).push().key;
        icon.attr('data',newKey);
        var refLikers = likers + newKey;
        updates[refLikers] = {
          uid: localStorage.getItem('userId')
        };
      }
      
      updates[ref] = parseInt(likes);
      firebase.database().ref().update(updates);
  };

    function getLikeHTML (liked, likes, key, likerKey) {
      
      if (liked) {
        return '<div class="likeButton"><i id="likeIcon" data="'+likerKey+'" class="fa fa-heart" style="font-size: 25px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+')"></i><span id = "likes">'+likes+'</span></div>';
      }
      return '<div class="likeButton"><i id="likeIcon"  data="'+likerKey+'"class="fa fa-heart-o" style="font-size: 25px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+')"></i><span id = "likes">'+likes+'</span></div>';
    }
    function addMarker(latlng, icon, map , animation, thoughts, sender, likers, key, likes) {

      var liked = false;
      var likerKey;
      angular.forEach(likers, function(liker,key) {
        if (liker.uid === localStorage.getItem('userId')) {
          liked = true;
         likerKey = key;
        }
      });
        var contentString = '<div id="content">'+
                            '<h3>'+sender+'</h3>'+
                            '<p>'+thoughts+
                            '</p>'+
                            '<div id="comments"></div>'+
                            '<form novalidate ng-submit="submitComment('+"'"+key+"'"+')"><input id="newComment" class="hidden" type="text" ng-model="commentInput" placeholder="Insert comment here"/></form>'+
                            '<div><button class="addComment" ng-click="addComment('+"'"+key+"'"+')">Comment</button>'+
                            getLikeHTML(liked, likes, key, likerKey)+
                            '</div></div>';

        var compiled = $compile(contentString)($scope);

        var options = {
                        content: compiled[0],
                        disableAutoPan : true
                      };
        var result = new google.maps.Marker({
                        position: latlng,
                        icon: icon,
                        map: map,
                        animation: animation
                        }).addListener('click', function () {
                          $scope.ib.close();
                          $scope.commentInput = "";
                          $scope.ib.setOptions(options);
                          $scope.ib.open(map,this);
                          map.panTo(latlng);
                        });
        $scope.markers.push(result);
        return result;
    }

    supersonic.data.channel('addMarker').subscribe( function(thoughtBubble) {
      supersonic.device.geolocation.getPosition().then( function(position){
        var LatLng = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
        $scope.map.panTo(LatLng);
        $scope.currentPosition.setPosition(LatLng);
      });
      var latlng = new google.maps.LatLng(thoughtBubble.lat, thoughtBubble.lng);
      addMarker(latlng,
                mapIcon(thoughtBubble.icon),
                $scope.map,
                google.maps.Animation.DROP,
                thoughtBubble.thought,
                thoughtBubble.sender,
                undefined,
                thoughtBubble.key,
                0);
    });
    
    steroids.tabBar.on('didchange', function() {
      supersonic.device.geolocation.getPosition().then( function(position){
        var LatLng = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
        $scope.map.panTo(LatLng);
        $scope.currentPosition.setPosition(LatLng);
      });
    });

    var updatePosition = function () {
        supersonic.device.geolocation.getPosition().then(function (position) {
            var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.currentPosition.setPosition(LatLng);
        });
    };
    $interval(updatePosition, 60000);
});
