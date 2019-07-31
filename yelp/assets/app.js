
var config = {
    apiKey: "AIzaSyCX9HaxgsICVmRMuHrcTMJHhqjRd9EmiTY",
    authDomain: "duh-travel-planner.firebaseapp.com",
    databaseURL: "https://duh-travel-planner.firebaseio.com",
    projectId: "duh-travel-planner",
    storageBucket: "",
    messagingSenderId: "773256992271",
    appId: "1:773256992271:web:a735bf1233024afd"
};
  // Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();

// // EVENTS https://api.yelp.com/v3/events/{id}
// // var query = $("#search-place").val().trim();
// var query = 'Los Angeles Public Library';

// // key=API_KEY
// // var apiK = "AIzaSyDRvnGMMVBNQ0762atQz6C1_-pIL29DCrQ";

// var queryURL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + query + "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyDRvnGMMVBNQ0762atQz6C1_-pIL29DCrQ";

// $.ajax({
//     url: queryURL,
//     method: "GET",
//     contentType: 'application/json',
//     cache: false,
//     success: function(response){
//         console.log(response);
//     }
// })
//     .then(function(response){

//     })
var region = $("#areaInput").val().trim();
var local = $("#reselectRegion").val().trim();
var catRest = $("#selectCategory").val("Restaurants");
var catEvent = $("#selectCategory").val("Local & Nearby Events");

var map;
var service;
var infowindow;

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    query: 'restaurant'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}