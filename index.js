// establishing global variables
var userLat;
var userLng;
let searchURL = 'https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/search/geo/point?';
var breweryLat;
var breweryLng;
var breweryCoords;
var userCoords;
var start = userCoords;
var end = breweryCoords;
var breweryName;


// begin geolocation
var userLocation = document.getElementById("coordinates");

// getLocation();

// check if geolocation is supported. if so, run the function. if not, display message
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        userLocation.innerHTML = "Geolocation is not supported by this browser.";
    }
}


// pull users coordinates and store data in variables
function showPosition(position) {
    // userLocation.innerHTML = "Latitude: " + position.coords.latitude + 
    // "<br>Longitude: " + position.coords.longitude;
    userLat = parseFloat(position.coords.latitude);
    userLng = parseFloat(position.coords.longitude);

    getDataFromBeerApi(searchURL);
}

// call for data from beer api
function getDataFromBeerApi() {
  const query = {
      lat: userLat,
      lng:  userLng,
      radius: 2,
      key: 'c0bfe1046bca5568424c1cc7d09ee817',
  }
  // console.log(searchURL + 'lat=' + query.lat + '&lng=' + query.lng + '&radius=' + query.radius + '&key=' + query.key)

  // pull brewery data
  fetch(searchURL + 'lat=' + query.lat + '&lng=' + query.lng + '&radius=' + query.radius + '&key=' + query.key)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // define variables with newly received geographical info
      response.json().then(function(data) {
      breweryName = data.data[0].brewery.name;
      breweryLat = data.data[0].latitude;
      breweryLng = data.data[0].longitude;
      breweryCoords = {lat: breweryLat,lng: breweryLng};
      userCoords = {lat: userLat, lng: userLng};
      // console.log(breweryName);
      // console.log(userCoords);

      var locations = [
        ['Your Location', userLat, userLng, 1],
        [breweryName, breweryLat, breweryLng, 2]
        ];

        initMap();


      });
    }
  )

  // initialize a new google map
  function initMap() {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: {lat: userLat, lng: userLng}
        });
        directionsDisplay.setMap(map);

        calculateAndDisplayRoute(directionsService, directionsDisplay);

        printBreweryName();

      }

      // route between user location and brewery location
      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: userCoords,
          destination: breweryCoords,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }

        });
      }

      function printBreweryName () {
      $('.brewery-name').html(`<h5>DIRECTIONS TO: </h5><h4>${breweryName}</h4>`);
      }

}

