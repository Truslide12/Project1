
// var config = {
//     apiKey: "AIzaSyCX9HaxgsICVmRMuHrcTMJHhqjRd9EmiTY",
//     authDomain: "duh-travel-planner.firebaseapp.com",
//     databaseURL: "https://duh-travel-planner.firebaseio.com",
//     projectId: "duh-travel-planner",
//     storageBucket: "",
//     messagingSenderId: "773256992271",
//     appId: "1:773256992271:web:a735bf1233024afd"
// };
//   // Initialize Firebase
// firebase.initializeApp(config);
// var database = firebase.database();

// var region = document.getElementById("areaInput");
// var local = document.getElementById("reselectRegion");
// var categ = document.getElementById("selectCategory");


// // var map;
// // var service;
// // var infowindow;

// // var search;
// // $("#letsGo.btn").on("click", function(){
// //     search = region;
// //     // setAutocompleteCountry();
// //     // initService();
// // })

// // $("#submit").on("click",function(){
// //     search = (local + categ);
// //     // setAutocompleteCountry();
// //     // initService();
// // })
// var city = document.getElementById('city');
// var state = document.getElementById('state');
// var tripSite = city + ',' + state + ',' + 'usa';

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.0522, lng: -118.2437},
    zoom: 13
  })
  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  // var input = tripSite;
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // var service = new google.maps.places.PlacesService(map);
console.log(autocomplete);
  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name']);
    
  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    console.log(place);
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
    // google.maps.places.PlaceResult
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);

  document.getElementById('use-strict-bounds')
      .addEventListener('click', function() {
        console.log('Checkbox clicked! New state=' + this.checked);
        autocomplete.setOptions({strictBounds: this.checked});
      });
    var center = new google.maps.LatLng();
    var request = {
      location: center,
      radius: 32000,
      types: ['bars', 'restaurants', 'cafe']
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}
function callback(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK){
    for (var i = 0; i < results.length; i++){
      createMarker(results[i]);
    }
  }
}
function createMarker (place){
  var placeLoc = place.geometry.location
  var marker = new google.maps.Marker({
    map:map,
    position: place.geometry.location
  })
}

// var request = {
//   placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
//   fields: ['name', 'formatted_address', 'place_id', 'geometry']
// };

// var infowindow = new google.maps.InfoWindow();
// var service = new google.maps.places.PlacesService(map);

// service.getDetails(request, function(place, status) {
//   if (status === google.maps.places.PlacesServiceStatus.OK) {
//     var marker = new google.maps.Marker({
//       map: map,
//       position: place.geometry.location
//     });
//     google.maps.event.addListener(marker, 'click', function() {
//       infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
//         'Place ID: ' + place.place_id + '<br>' +
//         place.formatted_address + '</div>');
//       infowindow.open(map, this);
//     });
//   }
// });

