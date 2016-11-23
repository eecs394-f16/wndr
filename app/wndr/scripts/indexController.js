angular
  .module('wndr')
  .controller('indexController', function (icons, $interval, $scope, supersonic, $compile, $window, $q) {

    $scope.markers = [];
    $scope.currentPosition = undefined;
    $scope.commentInput = "";
    $scope.likeCount = 0;

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

        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
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

        $scope.currentPosition = new google.maps.Marker({
                        position: latlng,
                        icon: icons.red_flag,
                        map: map,
                        animation: google.maps.Animation.DROP
                        }).addListener('click', function () {
                          $scope.ib.close();
                          $scope.commentInput = "";
                          var options = {
                            content: "This is your location",
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

    function showComments(key){
      var ref = "/thoughts/" + key +"/comments/";
       firebase.database().ref(ref).once('value').then(function (snapshot) {
          var commentElement = document.getElementById('comments'+key);
          var html = "";
            for (var comment in snapshot.val()) {
                html = html + '<div class="comment"><b>'+snapshot.val()[comment].username+'</b> '+snapshot.val()[comment].text+'</div>';
            }
          commentElement.innerHTML = html;
          commentElement.scrollTop = commentElement.scrollHeight;
          var listBox = document.getElementById('detail-panel');
          listBox.scrollTop = listBox.scrollHeight;
        });
    }

    $scope.submitComment = function (key){
      if ($scope.commentInput === ""){
        return;
      }
      document.activeElement.blur();
      var commentsId = 'comments' + key;
      var commentElement = document.getElementById(commentsId);
      commentElement.innerHTML = commentElement.innerHTML + '<div class="comment"><b>'+localStorage.getItem("username")+'</b> '+$scope.commentInput+'</div>';
      commentElement.scrollTop = commentElement.scrollHeight;
      postComment($scope.commentInput, key);
      $scope.commentInput = "";
    };

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
      });
      var commentId = 'comments' + key;
      var commentEls = document.getElementsByClassName(commentId);
      for (i = 0; i < commentEls.length; i++) {
          commentEls[i].innerHTML = 0;
      }
    }

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

  $scope.closeWndr = function () {
    var listBox = document.getElementById("detail-panel");
    while (listBox.firstChild) {
      listBox.removeChild(listBox.firstChild);
    }
    angular.element(listBox).addClass("hidden");
  };

  $scope.detailWndr = function (key) {
 
    closeAll();
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
      var likerKey;
      angular.forEach(thought.likers, function(liker,key) {
        if (liker.uid === localStorage.getItem('userId')) {
          liked = true;
         likerKey = key;
        }
      });
      var wndrIcon = mapIcon(thought.icon);
      var contentString =
      '<div id="content">'+
      '<img src="'+wndrIcon.url+'" class="avatar">'+
      '<span style="display : inline;">  '+thought.sender+'</span>'+
      '<div id="info-thoughts">"'+thought.thought+
      '"</div>'+
      '<div>'+
        getLikeHTML(liked, likes, key, likerKey)+
        '<br><i class="fa fa-comment" style="font-size: 15px; padding: 0px 10px; margin : 5px;" ng-click="closeWndr()"></i>'+
      '<span>(' + '<div class="inline comments'+key+'">' + comments + '</div>)</span></div>' +
      '<div id="comments'+key+'" class="comments"></div>'+
      '<form novalidate ng-submit="submitComment('+"'"+key+"'"+')">'+
      '<textarea id="newComment'+key+'" ng-change="updateChar()" class="input" rows="4" cols="50" maxlength="200" ng-model="commentInput" placeholder="Insert comment here"/>'+
      '<div class="charCount" id="characters">200</div> <div  class="charCount"> characters left</div>'+
      '<input type="submit" class="addComment" style="float: right;" id="submit" value="Comment" />'+'</form>'+
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

  function getLikeHTML (liked, likes, key, likerKey) {

    if (liked) {
      return '<div class="likeButton"><i id="likeIcon'+key+'" data="'+likerKey+'" class="fa fa-heart likeIcon'+key+'" style="font-size: 15px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+')"></i><span>('+'<div class="inline likes'+key+'" id="likes'+key+'">'+likes+'</div> likes)</span></div>';
    }
    return '<div class="likeButton"><i id="likeIcon'+key+'"  data="'+likerKey+'"class="fa fa-heart-o likeIcon'+key+'" style="font-size: 15px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+')"></i><span>('+'<div class="inline likes'+key+'" id="likes'+key+'">'+likes+'</div> likes)</span></div>';
  }
  function addMarker(latlng, icon, map , animation, key) {

      var result = new google.maps.Marker({
                      position: latlng,
                      icon: icon,
                      map: map,
                      animation: animation
                      }).addListener('click', function () {
                        closeAll();
                        $scope.commentInput = "";
                        $scope.updateMarker(key, map, latlng, this);
                      });
      result.key = key;
      result.position = latlng;
      $scope.markers.push(result);
      return result;
  }
  
  $scope.updateMarker= function (key, map, latlng, marker) {

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
              var likeHtml = getLikeHTML(liked, likes, snapshot.key, likerKey);
              var contentString = '<div id="content"> <img src="'+icon.url+'" class="avatar"> <span style="display : inline;">  '+thought.sender+'</span> <div id="info-thoughts">"'+thought.thought+'"</div> <div>'+likeHtml+'<br><i class=" fa fa-comment-o" style="font-size: 15px; padding: 10px; margin : 5px;" ng-click="detailWndr(' + "'" + snapshot.key + "'" + ')"></i><span>(' + '<div class="inline comments' + snapshot.key + '">' + comments+ '</div>)</span></div></div>';
              var compiled = $compile(contentString)($scope);
              $scope.ib.setOptions({
                content: compiled[0],
                disableAutoPan : true
              });
              $scope.ib.open(map,marker);
              map.panTo(latlng);
            });
  };

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
              thoughtBubble.key);
  });

  steroids.tabBar.on('didchange', function() {
    supersonic.device.geolocation.getPosition().then( function(position){
      var LatLng = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
      $scope.map.panTo(LatLng);
      $scope.currentPosition.setPosition(LatLng);
    });
  });

  $scope.listView = function() {
    closeAll();
    var listBox = document.getElementById('floating-panel');
    while (listBox.firstChild) {
      listBox.removeChild(listBox.firstChild);
    }
    var markers = $scope.markers;
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
          var likeHtml = getLikeHTML(liked, likes, key, likerKey);
          var HTML = '<div id="content"> <img src="'+icon.url+'" class="avatar"> <span style="display : inline;">  '+thought.sender+'</span> <div id="info-thoughts">"'+thought.thought+'"</div> <div>'+likeHtml+'<br><i class=" fa fa-comment-o" style="font-size: 15px; padding: 10px; margin : 5px;" ng-click="detailWndr(' + "'" + key + "'" + ')"></i><span>(' + '<div class="inline comments' + key + '">' + comments+ '</div>)</span></div></div>';
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

  $scope.mapView = function() {
    closeAll();
  };

  var updatePosition = function () {
      supersonic.device.geolocation.getPosition().then(function (position) {
          var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          $scope.currentPosition.setPosition(LatLng);
      });
  };
  $interval(updatePosition, 60000);

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
  
   $scope.updateChar = function() {
    
    var characters = $scope.thought.length;
    //var words = this.value.split(' ').length;
    document.getElementById('characters').innerHTML = 200 - characters;
    //document.getElementById('words').value = words;
    };
});
