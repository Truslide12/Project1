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
// Google Map Display
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0522, lng: -118.576},
    zoom: 8
  });
}

// Display region tag on side bar 
function displayRegion(input){
  // Create div to show the region input on the left side of the map
  var newDiv = $("<div>");
  newDiv.attr("id", "area-"+ areaDisplayCount);
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
function eventbrite(input, r){

  var queryURL = "https://www.eventbriteapi.com/v3/events/search/?expand=venue&token=" + eventbriteAPIKey + "&location.address=" + input + "&location.within=" + r + "mi";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response){
    // Log the resulting Object 
    console.log(queryURL);
    console.log(response);
    console.log(response.events);

    // Create a variable for events array
    var eventsArr = response.events;
    eventDisplay(eventsArr);
    
  });
}

// Display Events in Search Results
function eventDisplay(arr){
  for(var i = 0; i < arr.length; i++)
  {
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
  console.log(eventLatLongAddress);
}
// BUTTON CLICKS
// ==============================================================================
// Let's Go button Clicked
var areaDisplayCount = 0;
$("#letsGo").on("click", function(event){
  event.preventDefault();
  
  // Get the "value" from the user input textbox from initial page and store it a variable
  var areaInput = $("#areaInput").val().trim();
  
  // If User did not input anything
  if(areaInput === ""){
    //Invalid Input
    $("#areaInput").addClass("is-invalid");
    $("#initialRow").append("<div class='area invalid-feedback'> Please provide a valid city & state or zip code. </div>");
  }else{
    // Valid input
    $("#areaInput").addClass("is-valid").removeClass("is-invalid");
    $("div.area").remove();
    // Enter Main Page once user provides valid input
    $("header").hide();
    $("#plannerPage").show();
    
    displayRegion(areaInput);
    
    eventbrite(areaInput, gUserRadius);
    
    // Clear input
    $("#areaInput").val("");
  }
  
});

// User Select (Region & Category) Submit button clicked
$("#submit").on("click", function(event){
  event.preventDefault();
  // Grab user region input 
  var userCity = $("#city").val().trim();
  var userRadius = $("#radius").val().trim();
  var userCatergory = $("#selectCategory").val().trim();
  
  console.log(userCity);
  console.log(userRadius);
  console.log(userCatergory);
    
  // If user did and didn't input Region city (require user to input region)
  if (userCity === ""){
    $("#city").addClass("is-invalid");
  }else{
    $("#city").addClass("is-valid").removeClass("is-invalid");
    $("#searchResults").empty();
    
    // Display things based on if user picked restaurants or events
    if (userCatergory === "Local & Nearby Events"){
      // If user did and didn't input radius
      if(userRadius === ""){
        // gUserRadius = 25;
        eventbrite(userCity, gUserRadius);
      }else{
        // gUserRadius = parseInt(userRadius);
        eventbrite(userCity, parseInt(userRadius));
      }
      displayRegion(userCity);
    }else if(userCatergory === "Restaurants"){
      displayRegion(userCity);
    }
  }
});
  
// checkbox arr
var checkboxArr = [];
// Add to Planner button clicked
$("#addToPlanner").on("click", function(event){
  event.preventDefault();
  displayEventInPlanner(checkboxArr);
  checkboxArr = [];
});

// Display user selected events in their planner
function displayEventInPlanner(arr){
  for(var i = 0; i < arr.length; i++){
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

database.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val());
  
  var userplannerD = childSnapshot.val().plannerDate;
  var personalEvnt = childSnapshot.val().personalEvent;
  var evntName = childSnapshot.val().eventName;
  var evntDate = childSnapshot.val().eventDate;
  var evntInfo = childSnapshot.val().eventInfo;
  var evntIndex = childSnapshot.val().eventIndex;
  
  // Dynamically creating elements to input in user planner
  var newDiv = $("<div>").append(
      $("<p>").text(evntName),
      $("<p>").text(evntDate),
      $("<p>").text(evntInfo),
    );
    newDiv.addClass("border p-2 m-1");
    newDiv.attr("id", "userSelectEvent-" + evntIndex);
    
    var dateP = $("<p>").html("<span class='glyphicon glyphicon-bookmark' data-target='#plannerDate' aria-expanded='false' aria-controls='plannerDate'></span> " + userplannerD);
    dateP.addClass("mt-2 plannerDate");

    var comment = $("<p>").html("<span class='glyphicon glyphicon-hand-right' data-target='#personalEvent' aria-expanded='false' aria-controls='personalEvent'></span>&nbsp;&nbsp;" + personalEvnt + "</p>");
    comment.addClass("ml-5 personalEvent");
    
    // Add Selected Event/User Date/Personal Event in planner when user has selected any (undefined if not)
    if (evntIndex != undefined){
      $("#userPlanner").append(newDiv);
    }
    if (userplannerD != undefined){
      $("#userPlanner").append(dateP);
      // console.log(userplannerD);
    }
    if (personalEvnt != undefined){
      $("#userPlanner").append(comment);
    }
});

// User Planner Date Submit button clicked
$("#dateSubmit").on("click", function(){
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
$("#personalSubmit").on("click", function(){
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
$(document).ready(function(){
  // Hide Main Page initially
  $("#plannerPage").hide();

  // Google Map Display 
  initMap();

  // Trash Button clicked
  // Because we are creating click events on "dynamic" content, we can't just use the usual "on" "click" syntax.
  $(document.body).on("click", ".trash", function(){
    // Grab the number of the button 
    var trashBtnNum = $(this).attr("data-trash");
    $("#area-" + trashBtnNum).remove();
    $(this).remove();
  });

  // When event checkbox is clicked 
  $(document.body).on("click", ".form-check-input", function(){
    var checkNum = $(this).attr("data-eventbox");
    var checkState = $(this).attr("data-state");
    if(checkState === "unclicked"){
      checkboxArr.push(checkNum);
      $(this).attr("data-state", "clicked");
    }else{
      $(this).attr("data-state", "unclicked");
      var removeUnchecked = checkboxArr.indexOf(checkNum);
      console.log(removeUnchecked);
      checkboxArr.splice(removeUnchecked, 1);
    }
    console.log(checkboxArr);
  });
});