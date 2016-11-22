angular
  .module('wndr')
  .controller('indexController', function (icons, $interval, $scope, supersonic, $compile, $window, $q) {

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

        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        $scope.map = map;
        google.maps.event.addListener(map, 'bounds_changed', function() {
            $scope.bounds = map.getBounds();
        });
        $scope.overlay = new google.maps.OverlayView();
        $scope.overlay.draw = function() {}; // empty function required
        $scope.overlay.setMap($scope.map);
        $scope.map.addListener('click', function() {
          $scope.ib.close();
          $scope.closeWndr();
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
          var commentElement = document.getElementById('comments'+key);
          var html = "";
            for (var comment in snapshot.val()) {
                html = html + '<div class="comment">'+snapshot.val()[comment].text+'</div>';
            }
          commentElement.innerHTML = html;
          commentElement.scrollTop = commentElement.scrollHeight;
          var listBox = document.getElementById('detail-panel');
          listBox.scrollTop = listBox.scrollHeight;
        });
    }

    //$scope.addComment = function (key){
    //  angular.element(document.getElementsByClassName("input")).addClass('hidden');
    //  var input = angular.element(document.getElementById('newComment'+key));
    //  if (input.hasClass('hidden')) {
    //      input.removeClass('hidden');
    //  } else {
    //      $scope.submitComment(key);
    //  }
    //  input.addClass("comment");
    //  showComments(key);
    //  var element = $window.document.getElementById('newComment'+key);
    //    if(element)
    //      element.focus();
    //
    //};

    $scope.submitComment = function (key){
      if ($scope.commentInput === ""){
        return;
      }
      document.activeElement.blur();
      var commentsId = 'comments' + key;
      var commentElement = document.getElementById(commentsId);
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

      var iconId = "likeIcon"+ key;
      var likeId = "likes" + key;
      var like = document.getElementById(likeId);
      var icon = angular.element(document.getElementById(iconId));
      var ref = "/thoughts/" + key +"/likes";
      var likers = "/thoughts/" + key +"/likers/";
      var likes = parseInt(like.innerHTML);
      var likerKey = icon.attr('data');
      var updates = {};

      if (icon.hasClass('fa-heart')) {

        likes = likes - 1;
        like.innerHTML = likes;
        icon.removeClass('fa-heart');
        icon.addClass('fa-heart-o');
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

  $scope.closeWndr = function () {
    var listBox = angular.element(document.getElementById('detail-panel'));
    listBox.addClass('hidden');
  };

  $scope.detailWndr = function (key) {

    $scope.ib.close();
    document.getElementById("floating-panel").className = "hidden";
    var ref = "/thoughts/" + key;
    var listBox = document.getElementById('detail-panel');
    firebase.database().ref(ref).once('value').then(function (snapshot) {
      var thought = snapshot.val();
      var likes = 0;
      if (thought.likes) {

        likes = thought.likes;
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
      '</div>'+
      '<div id="comments'+key+'" class="comments"></div>'+
      '<form novalidate ng-submit="submitComment('+"'"+key+"'"+')">'+
      '<textarea id="newComment'+key+'" class="input" rows="4" cols="50" maxlength="200" ng-model="commentInput" placeholder="Insert comment here"/>'+
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
      return '<div class="likeButton"><i id="likeIcon'+key+'" data="'+likerKey+'" class="fa fa-heart" style="font-size: 15px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+')"></i><span>('+'<div class="inline" id="likes'+key+'">'+likes+'</div> likes)</span></div>';
    }
    return '<div class="likeButton"><i id="likeIcon'+key+'"  data="'+likerKey+'"class="fa fa-heart-o" style="font-size: 15px; padding: 10px;" ng-click="addLike('+"'"+key+"'"+')"></i><span>('+'<div class="inline" id="likes'+key+'">'+likes+'</div> likes)</span></div>';
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
                            '<img src="'+icon.url+'" class="avatar">'+
                            '<span style="display : inline;">  '+sender+'</span>'+
                            '<div id="info-thoughts">"'+thoughts+
                            '"</div>'+
                            '<div>'+
                              getLikeHTML(liked, likes, key, likerKey)+
                              '<br><i class=" fa fa-comment-o" style="font-size: 15px; padding: 0px 10px; margin : 5px;" ng-click="detailWndr('+"'"+key+"'"+')"></i>'+
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
                        closeAll();
                        $scope.commentInput = "";
                        $scope.ib.setOptions(options);
                        $scope.ib.open(map,this);
                        map.panTo(latlng);
                      });
      result.contentHTML = contentString;
      result.position = latlng;
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

  $scope.listView = function() {
    closeAll();
    document.getElementById("floating-panel").className = "";
    var markers = $scope.markers;
    var HTML = "";
    for (var i=0; i < markers.length; i++) {

      if(  $scope.bounds.contains(markers[i].position) ){

         HTML = HTML + markers[i].contentHTML;
      }
    }
    var compiledList = $compile(HTML)($scope);
    var listBox = document.getElementById('floating-panel');
    while (listBox.firstChild) {
      listBox.removeChild(listBox.firstChild);
    }
    for (var j=0; j < compiledList.length; j++) {

      listBox.appendChild(compiledList[j]);
    }
  };

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
    $scope.ib.close();
    document.getElementById("floating-panel").className = "hidden";
    $scope.closeWndr();
  }
});
