var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0522, lng: -118.576},
    zoom: 10
    console.log("map function is created");
  });
}

initMap();
console.log("map function is running and map should be rendered");