var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.0522, lng: -118.576 },
    zoom: 8
  });
}
// add on.click function for submit button that checks for zip or city, and state and runs the map function
$("#submit").on('click', function (event) {
  // first check if zip code filled in... if so, center map based on zip code
  // ToDo: See if there is a way to change the city state to zip code 
  if (zipcode != "") {
    var location = $("#zipCode").val().trim();
    var lat = '';
    var lng = '';
    var address = { location } /*or {city and state};*/
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
    console.log('Latitude: ' + lat + ' Logitude: ' + lng);
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: lat, lng: lng },
      zoom: 8
    });
    //--------------in case city state are filled in--------------------------
  } else {
    var city = $("#city").val().trim();
    var state = $("#state").val().trim();
    var lat = '';
    var lng = '';
    var address = {city and state};
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    });
    console.log('Latitude: ' + lat + ' Logitude: ' + lng);
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: lat, lng: lng },
      zoom: 8
  }
});


$(document).ready(function () {

  initMap();

})