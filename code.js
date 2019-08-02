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

    // Clear input
    $("#areaInput").val("");
  }

});

// User Select (Region & Category) Submit button clicked
$("#submit").on("click", function(event){
  event.preventDefault();

  // Grab user region input 
  var userCity = $("#city").val().trim();
  var userState = $("#state").val().trim();
  var userZip = $("#zip").val().trim();
  var userCatergory = $("#selectCategory").val().trim();

  // Create User Select Object
  var userSelect = {
    city: userCity,
    state: userState,
    zip: userZip,
    category: userCatergory
  };

  // If user didn't input anything
  if (userCity === "" && userState === "" && userZip === ""){
    $("#city").addClass("is-invalid");
    $("#state").addClass("is-invalid");
    $("#zip").addClass("is-invalid");
  }
  // If user enters anything, it will display by the precedence of city then state then zip
  else if(userCity !== ""){
    $("#city").addClass("is-valid").removeClass("is-invalid");
    displayRegion(userSelect["city"]);
  }else if(userState !== ""){
    $("#state").addClass("is-valid").removeClass("is-invalid");
    displayRegion(userSelect["state"]);
  }else if(userZip !== ""){
    $("#zip").addClass("is-valid").removeClass("is-invalid");
    displayRegion(userSelect["zip"]);
  }

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

})