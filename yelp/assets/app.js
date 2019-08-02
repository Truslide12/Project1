
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
var city = document.getElementById('city');
var state = document.getElementById('state');
var tripSite = city + ',' + state + ',' + 'usa';

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.0522, long: 118.2437},
    zoom: 13
  })
  var card = document.getElementById('pac-card');
  // var input = document.getElementById('pac-input');
  var input = tripSite;
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

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
    google.maps.places.PlaceResult
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
}
// var ac = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
// // $("#results").append("<li>" + ac + "</li>");
// google.maps.event.addListener(ac, 'place_changed', function(){
//     var place = ac.getPlace();
//     console.log(place.formatted_address);
//     console.log(place.url);
//     console.log(place.geometry.location);
//     types: ['geocode']
//     types: ['establishment']
//     types: ['(regions)']
//     types: ['(cites)']
// })
// console.log(ac);


// var input = document.getElementById('searchTextField');
// var options = {
//   types: ['geocode', 'establishment', '(regions)', '(cities)'],
//   componentRestrictions: {country: 'us'}
// };
// console.log(input);

// autocomplete = new google.maps.places.Autocomplete(input, options);
// console.log(autocomplete);

// function setAutocompleteCountry() {
//     var country = document.getElementById('country').value;
//     if (country == 'all') {
//       autocomplete.setComponentRestrictions({'country': []});
//       map.setCenter({lat: 15, lng: 0});
//       map.setZoom(2);
//     } else {
//       autocomplete.setComponentRestrictions({'country': country});
//       map.setCenter(countries[country].center);
//       map.setZoom(countries[country].zoom);
//     }
//     clearResults();
//     clearMarkers();
//   }

//   function initService() {
//     var displaySuggestions = function(predictions, status) {
//       if (status != google.maps.places.PlacesServiceStatus.OK) {
//         alert(status);
//         return;
//       }
  
//       predictions.forEach(function(prediction) {
//         var li = document.createElement('li');
//         li.appendChild(document.createTextNode(prediction.description));
//         document.getElementById('results').appendChild(li);
//       });
//     };
  
//     var service = new google.maps.places.AutocompleteService();
//     service.getQueryPredictions({ input: 'region' }, displaySuggestions);
//     service.getQueryPredictions({ input: 'local' }, displaySuggestions);
//   }