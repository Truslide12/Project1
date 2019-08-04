// FUNCTIONS
// ==============================================================================
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAbs3Xx0RxW7n9nhJ8LXzOm9psGdiceLt4",
  authDomain: "duh-travel-planner-17716.firebaseapp.com",
  databaseURL: "https://duh-travel-planner-17716.firebaseio.com",
  projectId: "duh-travel-planner-17716",
  storageBucket: "",
  messagingSenderId: "249284499532",
  appId: "1:249284499532:web:95ee69fd2ead262a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// A global array of objects with event Lat/Long & address
var eventLatLongAddress = [];

// var submitStr = '';

// Google Map Display
var address;
var place;
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.0522, lng: -118.576 },
    zoom: 13,

    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ]
  });
  var input = document.getElementById('city');
  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo('bounds', map);

  autocomplete.setFields(
    ['address_components', 'geometry', 'icon', 'name', 'place_id', 'price_level', 'rating', 'opening_hours', 'formatted_phone_number']);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  // $("#submit-button").on("click", function (event) {
  //   event.preventDefault();
  //   console.log("clicked");
  //   submitStr = 'place_changed';
  //   // console.log(submitStr);
  // });

  // submitStr = "place_changed";
  autocomplete.addListener('place_changed', function () {
    // console.log(submitStr);
    infowindow.close();
    marker.setVisible(false);
    // made "place" global
    place = autocomplete.getPlace();
    console.log(place);
    console.log(place.name);
    console.log(place.place_id);
    console.log(place.rating);
    console.log(place.price_level);
    console.log(place.opening_hours);
    console.log(place.formatted_phone_number);

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
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    })

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    address = '';
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


    // submitStr = '';
  });


  var center = new google.maps.LatLng();
  var request = {
    location: center,
    radius: 32000,
    types: ['bars', 'restaurants', 'cafe'],
  };
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}
function createMarker(place) {
  placeLoc = place.geometry.location
  marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 })
  })
}

// Display restaurants in search results
function restaurntDisplay(restaurantPlace){

  var newDiv = $("<div>");
  newDiv.addClass("border p-2");

  var p = $("<p>").html('<b>Name: </b>' + restaurantPlace.name + "<br />" + '<b>Address: </b>' + address + "<br />" + "<b>Phone Number: </b>" + restaurantPlace.formatted_phone_number + "<br />" + '<b>Operation Hours: </b>' + restaurantPlace.opening_hours.weekday_text + "<br />" + '<b>Rating: </b>' + restaurantPlace.rating + "<br />" + '<b>Price Range: </b>' + restaurantPlace.price_level + "<br />" + '<b>Google Place ID: </b>' + restaurantPlace.place_id);
  p.addClass("m-0 p-2");

  var eventBoxDiv = $("<div>");
  eventBoxDiv.addClass("form-check");
  var eventBox = $("<input>");
  eventBox.attr("data-eventBox", 0);
  eventBox.attr("type", "checkbox");
  eventBox.attr("data-state", "unclicked");
  eventBox.addClass("form-check-input");
  eventBoxDiv.append(eventBox);

  newDiv.append(p);
  newDiv.append(eventBoxDiv);
  newDiv.append("<br />");
  $("#searchResults").append(newDiv);
}

// Display region tag on side bar 
function displayRegion(input) {
  // Create div to show the region input on the left side of the map
  var newDiv = $("<div>");
  newDiv.attr("id", "area-" + areaDisplayCount);
  newDiv.addClass("border p-2 my-4 selectedRegion");
  // Create p for "area" text display 
  var areaP = $("<p>");
  areaP.addClass("m-0");
  areaP.html("<span class='glyphicon glyphicon-remove'></span>&nbsp;&nbsp;&nbsp;" + input);
  // Add p into our sub-region div
  newDiv.append(areaP);
  // Add area input to areaDisplay div 
  $("#areaDisplay").append(newDiv);

  // Creat trash button next to each of our area display
  var trashBtn = $("<button>");
  trashBtn.attr("data-trash", areaDisplayCount);
  trashBtn.attr("type", "button");
  trashBtn.addClass("trash float-right m-4 rounded");
  trashBtn.html("<span class='glyphicon glyphicon-trash' data-toggle='collapse' data-target='#remover' aria-expanded='false' aria-controls='remover'></span>");
  $("#trashButton").append(trashBtn);

  areaDisplayCount++;
}
// Global User Radius
var gUserRadius = 25;
// Eventbrite API
var eventbriteAPIKey = "2OWVIDMBHHXNW7ZZQ4KE";
// AJAX Call to Eventbrite
function eventbrite(input, r) {

  var queryURL = "https://www.eventbriteapi.com/v3/events/search/?expand=venue&token=" + eventbriteAPIKey + "&location.address=" + input + "&location.within=" + r + "mi";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // Log the resulting Object 
    console.log(queryURL);
    console.log(response);
    // console.log(response.events);

    // Create a variable for events array
    var eventsArr = response.events;
    eventDisplay(eventsArr);

  });
}

// Display Events in Search Results
function eventDisplay(arr) {
  for (var i = 0; i < arr.length; i++) {
    var newDiv = $("<div>");
    newDiv.attr("id", "event-" + i);
    newDiv.addClass("border p-4");

    var eventHeader = $("<h4>").text(arr[i].name.text);
    eventHeader.attr("id", "eventName-" + i);
    eventHeader.addClass("font-weight-bold");

    var eventImg = $("<img>");
    eventImg.attr("src", arr[i].logo.original.url);
    eventImg.attr("alt", arr[i].name.text);

    var convertedDate = moment(arr[i].start.local, "YYYY-MM-DDTHH:mm:ss")
    // console.log(convertedDate.format("MM/DD/YY hh:mm A"));
    var eventDate = $("<p>").html("<u>Start Date:</u> " + convertedDate.format("MM/DD/YY hh:mm A"));
    eventDate.attr("id", "eventDate-" + i);
    eventDate.addClass("font-weight-bold my-2");

    var eventInfo = $("<p>").text(arr[i].summary);
    eventInfo.attr("id", "eventInfo-" + i);
    eventInfo.addClass("m-0");

    var eventBoxDiv = $("<div>");
    eventBoxDiv.addClass("form-check");
    var eventBox = $("<input>");
    eventBox.attr("data-eventBox", i);
    eventBox.attr("data-state", "unclicked");
    eventBox.attr("type", "checkbox");
    eventBox.addClass("form-check-input");
    eventBoxDiv.append(eventBox);

    newDiv.append(eventHeader);
    newDiv.append(eventImg);
    newDiv.append(eventDate);
    newDiv.append(eventInfo);
    newDiv.append(eventBoxDiv);
    newDiv.append("<br />");

    $("#searchResults").append(newDiv);

    var latLongAddressObj = {
      address: arr[i].venue.address.localized_address_display,
      latitude: arr[i].venue.address.latitude,
      longitude: arr[i].venue.address.longitude,
    };

    eventLatLongAddress.push(latLongAddressObj);

  }
  // console.log(eventLatLongAddress);
}
// BUTTON CLICKS
// ==============================================================================
// Let's Go button Clicked
var areaDisplayCount = 0;
var userCatergory;
$("#letsGo").on("click", function (event) {
  event.preventDefault();
  $("header").hide();
  $("#plannerPage").show();
});

// User Select (Region & Category) Submit button clicked
$("#submit-button").on("click", function (event) {
  event.preventDefault();
  // Grab user region input 
  var userCity = $("#city").val().trim();
  var userRadius = $("#radius").val().trim();
  userCatergory = $("#selectCategory").val().trim();

  // console.log(userCity);
  // console.log(userRadius);
  // console.log(userCatergory);

  // If user did and didn't input Region city (require user to input region)
  if (userCity === "") {
    $("#city").addClass("is-invalid");
  } else {
    $("#city").addClass("is-valid").removeClass("is-invalid");
    $("#searchResults").empty();

    // Display things based on if user picked restaurants or events
    if (userCatergory === "Local & Nearby Events") {
      // If user did and didn't input radius
      if (userRadius === "") {
        // gUserRadius = 25;
        eventbrite(userCity, gUserRadius);
      } else {
        // gUserRadius = parseInt(userRadius);
        eventbrite(userCity, parseInt(userRadius));
      }
      displayRegion(userCity);
    } else if (userCatergory === "Restaurants") {
      displayRegion(userCity);
      restaurntDisplay(place);
    }
  }
});


// checkbox arr
var checkboxArr = [];
// Add to Planner button clicked
$("#addToPlanner").on("click", function (event) {
  event.preventDefault();
  if(userCatergory === "Local & Nearby Events"){
    displayEventInPlanner(checkboxArr);
    checkboxArr = [];
  }else if(userCatergory === "Restaurants"){
    displayRestaurantInPlanner(place);
  }
});

// Display user selected restaurants in their planner
function displayRestaurantInPlanner(restaurant){
  var newRestaurant = {
    rName: place.name,
    rAddress: address,
    rPhoneNum: place.formatted_phone_number 
  }
  // Uploads user selected restaurant to the database
  database.ref().push(newRestaurant);
}

// Display user selected events in their planner
function displayEventInPlanner(arr) {
  for (var i = 0; i < arr.length; i++) {
    var eIndex = arr[i];
    var eName = $("#eventName-" + arr[i]).text();
    var eDate = $("#eventDate-" + arr[i]).text();
    var eInfo = $("#eventInfo-" + arr[i]).text();
    console.log(eName);
    console.log(eDate);
    console.log(eInfo);

    // Creates local "temporary" object for holding user selected events
    var newEvent = {
      eventName: eName,
      eventDate: eDate,
      eventInfo: eInfo,
      eventIndex: eIndex
    };
    // Uploads user selected event to the database
    database.ref().push(newEvent);
  }
}

database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  var restName = childSnapshot.val().rName;
  var restAddress = childSnapshot.val().rAddress;
  var restPhoneNum = childSnapshot.val().rPhoneNum;
  var userplannerD = childSnapshot.val().plannerDate;
  var personalEvnt = childSnapshot.val().personalEvent;
  var evntName = childSnapshot.val().eventName;
  var evntDate = childSnapshot.val().eventDate;
  var evntInfo = childSnapshot.val().eventInfo;
  var evntIndex = childSnapshot.val().eventIndex;

  // Dynamically creating event elements to input in user planner
  var newDiv = $("<div>").append(
    $("<p>").text(evntName),
    $("<p>").text(evntDate),
    $("<p>").text(evntInfo),
  );
  newDiv.addClass("border p-2 m-1");
  newDiv.attr("id", "userSelectEvent-" + evntIndex);

  // Dynamically creating restaurant elements to input in user planner
  var newRestDiv = $("<div>");
  newRestDiv.addClass("border p-5 m-2");

  var pRest = $("<p>").html(restName + "<br /> Address: " + restAddress + "<br /> Phone Number: " + restPhoneNum);
  pRest.addClass("m-0");

  newRestDiv.append(pRest);

  var dateP = $("<p>").html("<span class='glyphicon glyphicon-bookmark' data-target='#plannerDate' aria-expanded='false' aria-controls='plannerDate'></span> " + userplannerD);
  dateP.addClass("mt-2 plannerDate");

  var comment = $("<p>").html("<span class='glyphicon glyphicon-hand-right' data-target='#personalEvent' aria-expanded='false' aria-controls='personalEvent'></span>&nbsp;&nbsp;" + personalEvnt + "</p>");
  comment.addClass("ml-5 personalEvent");

  // Add Selected Event/User Date/Personal Event in planner when user has selected any (undefined if not)
  if (evntIndex != undefined) {
    $("#userPlanner").append(newDiv);
  }
  if (userplannerD != undefined) {
    $("#userPlanner").append(dateP);
    // console.log(userplannerD);
  }
  if (personalEvnt != undefined) {
    $("#userPlanner").append(comment);
  }
  if(restName != undefined || restAddress != undefined || restPhoneNum != undefined){
    $("#userPlanner").append(newRestDiv);
  }
});

// User Planner Date Submit button clicked
$("#dateSubmit").on("click", function () {
  var userPlannerDate = $("#start-date").val().trim();
  // Create a Date object
  var userPlannerDateObj = {
    plannerDate: userPlannerDate
  };
  // Uploads user planner date to the database
  database.ref().push(userPlannerDateObj);

  // Clear date input
  $("#start-date").val("");
});

// User Personal Event button clicked
$("#personalSubmit").on("click", function () {
  var userPersonalEvent = $("#comment").val().trim();
  // Create a personal event object
  var personalEventObj = {
    personalEvent: userPersonalEvent
  };
  // Uploads user planner date to the database
  database.ref().push(personalEventObj);

  // Clear text area 
  $("#comment").val("");
});

// MAIN PROCESS
// ==============================================================================
// "document.ready" makes sure that our JavaScript doesn't get run until the HTML document is finished loading.
$(document).ready(function () {
  // Hide Main Page initially
  $("#plannerPage").hide();

  // Google Map Display 
  initMap();

  // Trash Button clicked
  // Because we are creating click events on "dynamic" content, we can't just use the usual "on" "click" syntax.
  $(document.body).on("click", ".trash", function () {
    // Grab the number of the button 
    var trashBtnNum = $(this).attr("data-trash");
    $("#area-" + trashBtnNum).remove();
    $(this).remove();
  });

  // When event checkbox is clicked 
  $(document.body).on("click", ".form-check-input", function () {
    var checkNum = $(this).attr("data-eventbox");
    var checkState = $(this).attr("data-state");
    if (checkState === "unclicked") {
      checkboxArr.push(checkNum);
      $(this).attr("data-state", "clicked");
    } else {
      $(this).attr("data-state", "unclicked");
      var removeUnchecked = checkboxArr.indexOf(checkNum);
      console.log(removeUnchecked);
      checkboxArr.splice(removeUnchecked, 1);
    }
    console.log(checkboxArr);
  });

});