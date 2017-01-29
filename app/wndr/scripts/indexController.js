angular
  .module('wndr')
  .controller('indexController', function (icons, $interval, $scope, supersonic, $compile, $window, $q) {
      $scope.viewHeight = window.innerHeight - document.getElementById('navbar').offsetHeight;
      $scope.inMapView = true;

  //markers keep track of all markers created
    var markers = [];
    // markerKeys stores all the keys of wndr created
    $scope.markerKeys = [];
    //currentPosition stores the marker for the user location
    $scope.currentPosition = undefined;
    $scope.commentInput = "";
    $scope.likeCount = 0;
    $scope.iconName = "";
    $scope.selected = undefined;
    $scope.thought = "";
    steroids.tabBar.hide();

    //refreshes markers on screen to update according to data base by reinitializing a new map
    $scope.refreshMarkers = function() {
      $scope.markerKeys = [];
      markers = [];
      closeAll();
      $scope.initMap();
    };
    
    //maps icon to icon object
    //var String
    //Returns object
     var mapIcon = function (iconName) {

        switch (iconName) {
          case 'heart' :
            return icons.heart;
          case 'angry':
            return icons.angry;
          case'sad' :
            return icons.sad;
          case 'laughingWithTears' :
            return icons.laughingWithTears;
          case 'thinking' :
            return icons.thinking;
          case 'grinning':
              return icons.grinning;
          case 'poop' :
              return icons.poop;
          case 'pin':
              return icons.pin;
          default:
              return icons.grinning;
        }
     };
    
    //view initialization
    var init = function () {
        supersonic.device.geolocation.getPosition().then( function(position){
            $scope.position = position;
            $scope.initMap();
        });
    };

    //Map initialization
    $scope.initMap = function() {
        var infoWindow = new google.maps.InfoWindow();
        $scope.ib = infoWindow;
        var latlng = new google.maps.LatLng($scope.position.coords.latitude, $scope.position.coords.longitude);

        var myOptions = {
            zoomControl: false,
            mapTypeControl: false,
            clickableIcons: false,
            zoom: 18,
            center: latlng,
            gestureHandling: 'greedy'
        };

        var styledMapType = new google.maps.StyledMapType(
          [{
            "featureType":"landscape.natural",
            "elementType":"geometry.fill",
            "stylers":[
                       {"visibility":"on"},
                       {"color":"#e0efef"}]
          },
          {
            "featureType":"poi",
            "elementType":"geometry.fill",
            "stylers":[
                       {"visibility":"on"},
                       {"hue":"#1900ff"},
                       {"color":"#c0e8e8"}]
          },
          {
            "featureType":"road",
            "elementType":"geometry",
            "stylers":[
                       {"lightness":100},
                       {"visibility":"simplified"}]
            },
            {
              "featureType":"road",
              "elementType":"labels",
              "stylers":[
                         {"visibility":"off"}]
            },
            {
              "featureType":"transit.line",
              "elementType":"geometry",
              "stylers":[{"visibility":"on"},
                         {"lightness":700}]
            },
            {
              "featureType":"water",
              "elementType":"all",
              "stylers":[{"color":"#7dcdcd"}]
            }]
        );

        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
        $scope.map = map;
        google.maps.event.addListener(map, 'bounds_changed', function() {
            $scope.bounds = map.getBounds();
        });
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.map.addListener('click', function() {
          closeAll();
        });
        google.maps.event.addListener(infoWindow, 'domready', function() {

        var iwOuter = $('.gm-style-iw');

        /* The DIV we want to change is above the .gm-style-iw DIV.
         * So, we use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
         */
        var iwBackground = iwOuter.prev();

        // Remove the background shadow DIV
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // Remove the white background DIV
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        });

        $scope.currentPosition = new google.maps.Marker({
                        position: latlng,
                        icon: icons.pin,
                        map: map,
                        animation: google.maps.Animation.DROP
                        }).addListener('click', function () {
                          $scope.ib.close();
                          $scope.commentInput = "";
                          var options = {
                            content: '<div class="infoContent"> This is your location</div>',
                            disableAutoPan : true
                          };
                          $scope.ib.setOptions(options);
                          $scope.ib.open(map,this);
                          map.panTo(latlng);
                        });

        firebase.database().ref('/thoughts/').once('value').then(function (snapshot) {
            for (var thought in snapshot.val()) {

                var latlng = new google.maps.LatLng(snapshot.val()[thought].lat, snapshot.val()[thought].lng);
                var likes = 0;
                var comments = 0;
                if (snapshot.val()[thought].likes) {
                  likes = snapshot.val()[thought].likes;
                }
                if (snapshot.val()[thought].comments) {
                    comments = Object.keys(snapshot.val()[thought].comments).length;
                }
                addMarker(latlng,
                          mapIcon(snapshot.val()[thought].icon),
                          $scope.map,
                          google.maps.Animation.DROP,
                          thought);
            }
        });
    };
    google.maps.event.addDomListener(window, 'load', init);

    //shows comment from database
    //var string key
    function showComments(key){
      var ref = "/thoughts/" + key +"/comments/";
       firebase.database().ref(ref).once('value').then(function (snapshot) {
          var commentElement = document.getElementById('comments'+key);
          var html = "";
            for (var comment in snapshot.val()) {
                html = html + '<div class="commentUser">'+snapshot.val()[comment].username+'</div><div class="commentText">'+snapshot.val()[comment].text+'</div>';
            }
          commentElement.innerHTML = html;
          commentElement.scrollTop = commentElement.scrollHeight;
          var listBox = document.getElementById('detail-panel');
          listBox.scrollTop = listBox.scrollHeight;
        });
    }

    //receive and process comment submitted
    //var string key
    $scope.submitComment = function (key){
      if ($scope.commentInput === ""){
        return;
      }
      document.activeElement.blur();
      var commentsId = 'comments' + key;
      var commentElement = document.getElementById(commentsId);
      commentElement.innerHTML = commentElement.innerHTML + '<div class="commentUser">'+localStorage.getItem("username")+'</div><div class="commentText">'+$scope.commentInput+'</div>';
      commentElement.scrollTop = commentElement.scrollHeight;
      postComment($scope.commentInput, key);
      $scope.commentInput = "";
    };

    //post comment submitted
    //var string inputText, string key
    function postComment(inputText, key) {
      var input = {
        text: inputText,
        username: localStorage.getItem('username')
      };
      var ref = "/thoughts/" + key +"/comments/";
      var newKey = firebase.database().ref(ref).push().key;
      var updates = {};
      updates[ref + newKey] = input;
      firebase.database().ref().update(updates, function (err) {
          if (err) {
              alert('oh no! the database was not updated!');
          }
          $scope.detailWndr(key);
      });
      var commentId = 'comments' + key;
      var commentEls = document.getElementsByClassName(commentId);
      for (i = 0; i < commentEls.length; i++) {
          commentEls[i].innerHTML = 0;
      }
    }

    //toggle like/ unlike function to keep track of like counts and updating the database
    //var string key
    $scope.addLike = function (key) {

      var iconId = "likeIcon"+ key;
      var likeId = "likes" + key;
      var like = document.getElementById(likeId);
      var iconEl;
      var icon = angular.element(document.getElementById(iconId));
      var ref = "/thoughts/" + key +"/likes";
      var likers = "/thoughts/" + key +"/likers/";
      var likes = parseInt(like.innerHTML);
      var likerKey = icon.attr('data');
      var updates = {};
      var iconEls = document.getElementsByClassName(iconId);
      var likeEls = document.getElementsByClassName(likeId);

      if (icon.hasClass('fa-heart')) {

        likes = likes - 1;
        for (i=0; i<iconEls.length; i++) {
           iconEl = angular.element(iconEls[i]);
           iconEl.removeClass('fa-heart');
           iconEl.addClass('fa-heart-o');
         }
        firebase.database().ref(likers+likerKey).remove();
      } else{

        likes = likes + 1;
        for (i=0; i<iconEls.length; i++) {
          iconEl = angular.element(iconEls[i]);
          iconEl.removeClass('fa-heart-o');
          iconEl.addClass('fa-heart');
        }
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

      for (i=0; i<likeEls.length; i++) {
        likeEls[i].innerHTML = likes;
      }
      updates[ref] = parseInt(likes);
      firebase.database().ref().update(updates);
  };

  //closes the detail box of a wndr
  $scope.closeWndr = function () {
    var listBox = document.getElementById("detail-panel");
    while (listBox.firstChild) {
      listBox.removeChild(listBox.firstChild);
    }
    angular.element(listBox).addClass("hidden");
  };

  //opens the detail box of a wndr
  //var string key
  $scope.detailWndr = function (key) {

    closeAll();
    listButton = new supersonic.ui.NavigationBarButton( {
        styleClass: 'listNavButton',
        title: ' ',
        onTap: function() {
          $scope.toggleListView();
        }
        });
    supersonic.ui.navigationBar.update({
      buttons: {
        left: [listButton]
      }
    });
    var ref = "/thoughts/" + key;
    var listBox = document.getElementById('detail-panel');
    listBox.className = "";
    firebase.database().ref(ref).once('value').then(function (snapshot) {
      var thought = snapshot.val();
      var likes = 0;
      if (thought.likes) {
        likes = thought.likes;
      }
      var comments = 0;
      if (thought.comments) {
          comments = Object.keys(thought.comments).length;
      }
      var liked = false;
      var canDelete = false;
      var likerKey;
      angular.forEach(thought.likers, function(liker,key) {
        if (liker.uid === localStorage.getItem('userId')) {
          liked = true;
         likerKey = key;
        }
      });
      if (thought.userId == localStorage.getItem('userId')) {
        canDelete = true;
      }
      var wndrIcon = mapIcon(thought.icon);
      var contentString =
      '<div class="infoContent content"><div class="header">'+
      '<img src="'+wndrIcon.url+'" class="avatar">'+
      '<span style="display : inline;">  '+thought.sender+'</span>'+getDeleteOption(canDelete, snapshot.key)+'</div>'+
      '<div class="info-thoughts">"'+thought.thought+
      '"</div>'+
      '<div><div style="width: 100%">' +
      getLikeHTML(liked, likes, key, likerKey) +
      '<div style="float: right; display: inline" class="iconButton">' +
      getCommentIconHTML(comments, "closeWndr()")+
      '<span>(' + '<div class="inline comments'+key+'">' + comments + '</div>)</span>' +
      '</div></div>' +
      '<form novalidate style="width: 100%;" ng-submit="submitComment(' + "'" + key + "'" + ')">' +
      '<div style="width: 100%"; text-align:center"><textarea id="newComment' + key + '" ng-change="updateChar()" class="newCommentText" rows="1" cols="50" maxlength="200" ng-model="commentInput" placeholder="Enter comment here."/>' +
      '<input type="submit" class="addComment" id="submit" value="Comment" /></div>' +
      '</form>' +
      '<div class="charCountContainer"><div class="charCount">' +
      '<div id="characters">200</div><div> characters left</div>' +
      '</div></div></div>' +
      '<div id="comments' + key + '" class="comments"></div>' +
      '</div>';

      var compiledList = $compile(contentString)($scope);
      listBox.className = "";
      while (listBox.firstChild) {
        listBox.removeChild(listBox.firstChild);
      }
      var promises = [];
      angular.forEach (compiledList, function(compiledEl) {
        promises.push(compiledEl);
        listBox.appendChild(compiledEl);
      });
      $q.all(promises).then(function () {
        showComments(key);
        });
    });
  };

  //generate html string representing the like button
  //var bool liked
  //var int likes
  //var string key, string likerKey
  //returns string
  function getLikeHTML (liked, likes, key, likerKey) {

    if (liked) {
      return '<div class="iconButton"><i id="likeIcon'+key+'" data="'+likerKey+'" class="fa fa-heart likeIcon'+key+'" ng-click="addLike('+"'"+key+"'"+')"></i><span>('+'<div class="inline likes'+key+'" id="likes'+key+'">'+likes+'</div>)</span></div>';
    }
    return '<div class="iconButton"><i id="likeIcon'+key+'"  data="'+likerKey+'"class="fa fa-heart-o likeIcon'+key+'" ng-click="addLike('+"'"+key+"'"+')"></i><span>('+'<div class="inline likes'+key+'" id="likes'+key+'">'+likes+'</div>)</span></div>';
  }
  
  function getCommentIconHTML (comments, callback) {
    
    if (comments === 0 ) {
      return '<i class="fa fa-comment-o" ng-click="'+callback+'"></i>';
    } else {
      return '<i class="fa fa-comment" ng-click="'+callback+'"></i>';
    }
  }
  
  //adds a marker on the map from a wndr
  //var LatLng latlng
  //var object icon
  //var google.maps map
  //var google.maps.animation animation
  //var string key
  //returns object result
  function addMarker(latlng, icon, map , animation, key) {

      var result = {};
      var marker = new google.maps.Marker({
                          position: latlng,
                          icon: icon,
                          map: map,
                          animation: animation
                          }).addListener('click', function () {
                            closeAll();
                            $scope.commentInput = "";
                            $scope.updateMarker(key, map, latlng, this);
                          });
      markers.push(marker);
      result.position = latlng;
      result.key = key;
      $scope.markerKeys.push(result);
      return result;
  }
  
  function getDeleteOption(canDelete, key) {
    if (canDelete) {
      return '<div style="display: inline; float: right;" ng-click="deleteWndr('+"'"+key+"'"+')"><i class="fa fa-ellipsis-h"></i></div>';
    }
    return '';
  }
  
  $scope.deleteWndr = function(key) {
    var deletePanel = angular.element(document.getElementById('delete-panel'));
    deletePanel.removeClass('hidden');
    var contentString = '<div ng-click="removeFromFirebase ('+"'"+key+"'"+')">Delete Wndr</div>';
    var compiled = $compile(contentString)($scope);
    var deleteButton = document.getElementById('deleteWndr');
    angular.forEach (compiled, function(compiledEl) {
        deleteButton.appendChild(compiledEl);
    });
  };

  $scope.cancelDelete = function() {
    var deletePanel = angular.element(document.getElementById('delete-panel'));
    deletePanel.addClass('hidden');
    document.getElementById('deleteWndr').innerHTML = '';
  };
  
  $scope.removeFromFirebase = function(key) {
    
    firebase.database().ref('/thoughts/'+key).remove();
    $scope.refreshMarkers();
    $scope.cancelDelete();
    closeAll();
  };
  //updates a marker on the map with wndr contents on database
  //var string key
  //var google.maps map
  //var LatLng latlng
  //var google.maps.Marker marker
  $scope.updateMarker= function (key, map, latlng, marker) {

    firebase.database().ref('/thoughts/'+key).once('value').then(function (snapshot) {

              var thought = snapshot.val();
              var liked, canDelete = false;
              var likerKey;
              angular.forEach(thought.likers, function(liker,key) {
                if (liker.uid === localStorage.getItem('userId')) {
                  liked = true;
                 likerKey = key;
                }
              });
              var likes = 0;
              if (thought.likes) { likes = thought.likes;}
              var comments = 0;
              if (thought.comments) {
                  comments = Object.keys(thought.comments).length;
              }
              if (thought.userId == localStorage.getItem('userId')) {
                canDelete = true;
              }
              var icon = mapIcon(thought.icon);
              var callback = 'detailWndr(' + "'" + snapshot.key + "'" + ')';
              var contentString = '<div class="infoContent content">'+
                                  '<div class="header"><img src="'+icon.url+'" class="avatar" ng-click="'+callback+'"> <span style="display : inline;" ng-click="'+callback+'">  '+
                                    thought.sender+'</span>'+getDeleteOption(canDelete, snapshot.key)+'</div>'+
                                    ' <div class="info-thoughts" ng-click="'+callback+'">"'+thought.thought+'"</div>'+
                                    '<div style="width: 100%">' +
                                    getLikeHTML(liked, likes, key, likerKey) +
                                    '<div style="float: right; display: inline" class="iconButton" ng-click="'+callback+'">' +
                                    getCommentIconHTML(comments, callback) +
                                    '<span>(' + '<div class="inline comments'+snapshot.key+'">' + comments + '</div>)</span>' +
                                    '</div></div></div>';
              var compiled = $compile(contentString)($scope);
              $scope.ib.setOptions({
                content: compiled[0],
                disableAutoPan : true
              });
              $scope.ib.open(map,marker);
              map.panTo(latlng);
            });
  };

  //toggles the list View
  $scope.listView = function() {
      closeAll();
      document.getElementById("navbar__icon").src = "/img/mapView.png";
      $scope.inMapView = false;
    var listBox = document.getElementById('floating-panel');
    while (listBox.firstChild) {
      listBox.removeChild(listBox.firstChild);
    }
    var markers = $scope.markerKeys;
    var key;
    var keys = [];
    var promises = [];
    angular.forEach (markers, function(marker) {
       if( $scope.bounds.contains(marker.position) ){

         key = marker.key;
         keys.push(key);
         promises.push(key);
      }
    });
    $q.all(promises).then(function () {
      updateList(keys);
      });
  };

  //updates list view with wndr contents from database
  function updateList(keys) {

    var listBox = document.getElementById('floating-panel');
    var promises = [];
    angular.forEach (keys, function(key) {
      firebase.database().ref('/thoughts/'+key).once('value').then(function (snapshot) {

          var thought = snapshot.val();
          var liked = false;
          var likerKey;
          angular.forEach(thought.likers, function(liker,key) {
            if (liker.uid === localStorage.getItem('userId')) {
              liked = true;
             likerKey = key;
            }
          });
          var likes = 0;
          if (thought.likes) { likes = thought.likes;}
          var comments = 0;
          if (thought.comments) {
              comments = Object.keys(thought.comments).length;
          }
          var icon = mapIcon(thought.icon);
          var HTML =
          '<div class="content"><div class="row" ng-click="detailWndr(' + "'" + key + "'" + ')">'+
          '<div class="col col-20"><img style="width: 100%;" src="'+icon.url+'">'+
          '<div style="text-align: center;">'+thought.sender+'</div></div><div class="col col-80"> <div class="info-thoughts">"'+thought.thought+'"</div></div></div><div class="hr"></div>';
          
          var compiledList = $compile(HTML)($scope);
          var promises2 = [];
          angular.forEach (compiledList, function(compiledEl) {
            promises2.push(compiledEl);
            listBox.appendChild(compiledEl);
          });
          $q.all(promises2).then(function () {
            promises.push(key);
            });
     });
    });
    $q.all(promises).then(function () {
      listBox.className = "";
    });
  }

  //toggles map view
  $scope.mapView = function() {
      closeAll();
      document.getElementById("navbar__icon").src = "/img/listView.png";
      $scope.inMapView = true;
  };

  //update user position every 60 seconds using interval
  var updatePosition = function () {
      supersonic.device.geolocation.getPosition().then(function (position) {
          var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          $scope.currentPosition.setPosition(LatLng);
      });
  };
  $interval(updatePosition, 60000);

  //closes all detail boxes or list views generated and return to the default view
  function closeAll() {
    document.activeElement.blur();
    $scope.ib.close();
    var listBox = document.getElementById("floating-panel");
    while (listBox.firstChild) {
      listBox.removeChild(listBox.firstChild);
    }
    listBox.className = "hidden";
    $scope.closeWndr();
  }
  
  //update Character count of comment
  $scope.updateChar = function() {
    
    var characters = $scope.commentInput.length;
    //var words = this.value.split(' ').length;
    document.getElementById('characters').innerHTML = 200 - characters;
    //document.getElementById('words').value = words;
    };
  
  //update character count of new wndr
  $scope.updateCharWndr = function() {
  
    var characters = $scope.thought.length;
    //this function is just for developers to easily exit the post wndr page
    if ($scope.thought === 'Naybro' || $scope.thought === 'naybro' ) {
      document.activeElement.blur();
      $scope.newWndr();
      $scope.thought = "";
      return;
    }
    //var words = this.value.split(' ').length;
    document.getElementById('charactersWndr').innerHTML = 200 - characters;
    //document.getElementById('words').value = words;
  };
  
  //cancels the posting of a wndr and returns to the default view
  $scope.stopPost = function() {
    document.activeElement.blur();
    $scope.newWndr();
    $scope.thought = "";
    document.getElementById('charactersWndr').innerHTML = 200;
    return;
  };
  
  //processes the icon selected in the new wndr view
  //var $event
  //var string icon
  $scope.setIcon = function($event, icon) {
    
    if ($scope.selected !== undefined ) {
      $scope.selected.removeClass('selected');
    }
    angular.element($event.currentTarget).addClass('selected');
    $scope.selected = angular.element($event.currentTarget);
    $scope.iconName = icon;
  };
  
  //creates view to create new wndr
  $scope.newWndr = function () {
      closeAll();
      $scope.mapView();
   var wndrOverlay = angular.element(document.getElementById('new_wndr'));
   if (wndrOverlay.hasClass('hidden')) {
      wndrOverlay.removeClass('hidden');
   } else {
     wndrOverlay.addClass('hidden');
   }
  };
  
  //post a new Wndr
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

    //process input from the new wndr view
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

        var thoughtBubble = {
        thought: $scope.thought,
        sender: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        icon: $scope.iconName,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        likes: 0
        };

        thoughtBubble = addToFirebase(thoughtBubble);
        $scope.iconName = "";
        $scope.selected = undefined;
        $scope.thought = "";

        var LatLng = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
              
        addMarker(LatLng,
                  mapIcon(thoughtBubble.icon),
                  $scope.map,
                  google.maps.Animation.DROP,
                  thoughtBubble.key);
        $scope.map.panTo(LatLng);

        var wndrOverlay = angular.element(document.getElementById('new_wndr'));
        wndrOverlay.addClass('hidden');
        
        $scope.currentPosition.setPosition(LatLng);
      });
    };
});
