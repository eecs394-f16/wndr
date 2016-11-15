angular
  .module('wndr')
  .controller('indexController', function ($scope, supersonic, $compile,$window) {

    newListingBtn = new supersonic.ui.NavigationBarButton({
      onTap: function() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
          alert("Successfully logged out");
          var view = new supersonic.ui.View("wndr#login");
          supersonic.ui.layers.push(view);

        }, function(error) {
          // An error happened.
        });

      },
      styleId: "nav-logout"
    });
    $scope.markers = [];
    $scope.currentPosition = undefined;
    $scope.commentInput = "";

    var icons = {
        heart: {
          url: "/emojis/heavy-black-heart.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
        },
        angry: {
          url: "/emojis/Very_Angry_Emoji.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
        },
        sad: {
          url: "/emojis/Very_sad_emoji_icon_png.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
        },
        tongueOut: {
          url: "/emojis/Tongue_Out_Emoji_with_Winking_Eye.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
        },
        happyTears: {
          url: "/emojis/Tears_of_Joy_Emoji.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
        },
        thinking: {
          url: "/emojis/Thinking_Face_Emoji.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
        },
         smiling: {
          url: "/emojis/Smiling_Emoji_with_Eyes_Opened.png",
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0)
         },
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
         },
         unamused: {
             url: "/emojis/Unamused_Face_Emoji.png",
             scaledSize: new google.maps.Size(30, 30),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(0, 0)
         },
         red_flag: {
             url: "/emojis/Red_Flag_Emoji.png",
             scaledSize: new google.maps.Size(30, 30),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(0, 0)
         }
     };
    localStorage.setItem('icons', icons);

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
      var dropdown = angular.element(document.getElementById('dropdownToggle'));
      var input = angular.element(document.getElementById('newComment'));
      input.removeClass('hidden');
      input.addClass("comment");
      if ( dropdown.hasClass('fa-caret-down')) {
        dropdown.removeClass('fa-caret-down');
        }
      if (!dropdown.hasClass('fa-caret-up')) {
        dropdown.addClass('fa-caret-up');
      }
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

    $scope.dropdown = function ($event, key){
      var el = angular.element($event.currentTarget);
      if (el.hasClass( "fa-caret-down")) {
        el.removeClass('fa-caret-down');
        el.addClass('fa-caret-up');
        showComments(key);
      } else {
        el.removeClass('fa-caret-up');
        el.addClass('fa-caret-down');
        var input = angular.element(document.getElementById('newComment'));
        if (input.hasClass('comment')) {
          input.removeClass('comment');
          input.addClass("hidden");
        }
        document.getElementById('comments').innerHTML = "";
      }
    };

    $scope.addLike = function (key,likes) {

      var like = document.getElementById('likes');
      var icon = angular.element(document.getElementById('likeIcon'));
      like.innerHTML = likes + 1;
      if (icon.hasClass('fa-heart')) {
        return;
      }
      icon.removeClass('fa-heart-o');
      icon.addClass('fa-heart');
      var ref = "/thoughts/" + key +"/likes";
      var likers = "/thoughts/" + key +"/likers/";
      var newKey = firebase.database().ref(likers).push().key;
      var refLikers = likers + newKey;
      var updates = {};
      updates[ref] = parseInt(likes) + 1;
      updates[refLikers] = {
        uid: localStorage.getItem('userId')
      };
      firebase.database().ref().update(updates);
    };

    function getLikeHTML (liked, likes, key) {

      if (liked) {
        return '<div class="likeButton"><i class="fa fa-heart" style="font-size: 25px; padding: 10px;"></i><span id = "likes">'+likes+'</span></div>';
      }
      return '<div class="likeButton"><i id="likeIcon" class="fa fa-heart-o" style="font-size: 25px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+','+likes+')"></i><span id = "likes">'+likes+'</span></div>';
    }
    function addMarker(latlng, icon, map , animation, thoughts, sender, likers, key, likes) {

      var liked = false;
      angular.forEach(likers, function(liker) {
        if (liker.uid === localStorage.getItem('userId')) {
          liked = true;
        }
      });
        var contentString = '<div id="content">'+
                            '<h3>'+sender+'</h3>'+
                            '<p>'+thoughts+
                            '</p>'+
                            '<div id="comments"></div>'+
                            '<form novalidate ng-submit="submitComment('+"'"+key+"'"+')"><input id="newComment" class="hidden" type="text" ng-model="commentInput" placeholder="Insert comment here"/></form>'+
                            '<div><button class="addComment" ng-click="addComment('+"'"+key+"'"+')">Comment</button>'+
                            getLikeHTML(liked, likes, key)+
                            '<span><i style="font-size: 36px;" id="dropdownToggle" class="expandButton fa fa-caret-down" ng-click="dropdown($event,' + "'" + key + "'" + ')"></i></span></div>' +
                            '</div>';

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
});
