var map;
var markers = [];

//this function initializes the google map on the screen

function initMap() {
	var options = {
		zoom: 9,
		center: {lat: 29.7604, lng: -95.3698}
	}

	map = new google.maps.Map(document.getElementById('map'), options)

	
	//This function allows you to plug in coordinates and it'll generate a marker on the map
	function addMarker(coords) {
		var marker = new google.maps.Marker({
			position: coords,
			map: map
		})
		markers.push(marker);
	}

	//function that goes through the markers array - helps to delete markers

	function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      //function that sets the setMapOnAll function to null - helps to delete markers

	function clearMarkers() {
        setMapOnAll(null);
      }

      //function that calls the clearMarkers() function and emptys out the markers array

	function deleteMarkers() {
		clearMarkers();
		markers = [];
	}

	// API Website https://developers.zomato.com/documentation#!/restaurant/search

var queryURL1 = "https://developers.zomato.com/api/v2.1/cuisines?city_id=277&lat=29.7604&lon=-95.3698"
var api_key = "c401c9eff451fccdbc6ac1dbacaa0e55"
var cuisineList = [];
var lat = [];
var long = [];
var restaurants = 1;

// this first ajax gets the cuisine list from zomato and pushes it into the array of cuisineList
	
	$.ajax({
		url: queryURL1,
		headers: { 'user-key': api_key },
		method: "GET"
	}).done(function(response){

		for (var i = 0; i < response.cuisines.length; i++) {
		cuisineList.push(response.cuisines[i].cuisine.cuisine_name);
	}

		// console.log(cuisineList);

//When you click on this button with the ID of random...
 	$("#random").on("click", function() {

// .. it gets a random string from the cuisineList array using the Math.random()..
		var cuisineRandom = cuisineList[Math.floor(Math.random() * cuisineList.length)];
// .. then it adds the text of whatever cuisine it chose to the HTML page..
		$("#cuisine").text(cuisineRandom)

		var queryURL2 = "https://developers.zomato.com/api/v2.1/search?entity_type=city&q=" + cuisineRandom + "&count=3&lat=29.7604&lon=-95.3698&radius=40000"
		lat = [];
		long = [];
		restaurants = 1;
		info = 1;
		
		deleteMarkers();

// then it calls another ajax function that uses the queryURL2 up above and utilizes the random cuisine it chose in its search to find 5 restaurants that are related to that cuisine...


	$.ajax({
		url: queryURL2,
		headers: { 'user-key': api_key },
		method: "GET"
	}).done(function(response) {
		//this creates an initial JSON response to find what information you need
		console.log(response.restaurants);

	if (response.restaurants.length === 0) {

			for (var i = 0; i < 3; i++) {

			$("#restaurant-" + restaurants).text("No Restaurants Found")

		
		$("#info-" + info).html("");

		info++
		restaurants++
			
			}

		}


	else if (response.restaurants.length === 1) {

			for (var i = 0; i < 2; i++) {

			$("#restaurant-" + restaurants).text("")

		
		$("#info-" + info).html("");

		info++
		restaurants++

		}

			for (var i = 0; i < 1; i++) {

				$("#restaurant-" + restaurants).text(response.restaurants[i].restaurant.name)

			
		$("#info-" + info).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
		"<p><strong>Rating:</strong> " + response.restaurants[i].restaurant.user_rating.aggregate_rating + "</p>" +
		"<p><strong>Rank:</strong> " + response.restaurants[i].restaurant.user_rating.rating_text + "</p>" +
		"<p><strong>Number Of Votes:</strong> " + response.restaurants[i].restaurant.user_rating.votes + "</p>");

			}
			

		}

		else if (response.restaurants.length === 2) {

			for (var i = 0; i < 1; i++) {

			$("#restaurant-" + restaurants).text("")

		
		$("#info-" + info).html("");

		info++
		restaurants++

		}

			for (var i = 0; i < 2; i++) {

				$("#restaurant-" + restaurants).text(response.restaurants[i].restaurant.name)

			
		$("#info-" + info).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
		"<p><strong>Rating:</strong> " + response.restaurants[i].restaurant.user_rating.aggregate_rating + "</p>" +
		"<p><strong>Rank:</strong> " + response.restaurants[i].restaurant.user_rating.rating_text + "</p>" +
		"<p><strong>Number Of Votes:</strong> " + response.restaurants[i].restaurant.user_rating.votes + "</p>");

			}
			

		}

	else {

		for (var i = 0; i < response.restaurants.length; i++) {

			$("#restaurant-" + restaurants).text(response.restaurants[i].restaurant.name)

			//then it runs through this for loop creating a console.log for each of the 3 restaurants...
		
		$("#info-" + info).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
		"<p><strong>Rating:</strong> " + response.restaurants[i].restaurant.user_rating.aggregate_rating + "</p>" +
		"<p><strong>Rank:</strong> " + response.restaurants[i].restaurant.user_rating.rating_text + "</p>" +
		"<p><strong>Number Of Votes:</strong> " + response.restaurants[i].restaurant.user_rating.votes + "</p>");
		console.log("Latitude: " + response.restaurants[i].restaurant.location.latitude);
		console.log("Longitude: " + response.restaurants[i].restaurant.location.longitude);
		console.log("Image: " + response.restaurants[i].restaurant.photos_url)

		//we then are pushing the float number (decimal number) into the lat/long array...

		lat.push(parseFloat(response.restaurants[i].restaurant.location.latitude));
		long.push(parseFloat(response.restaurants[i].restaurant.location.longitude));

		console.log(lat);
		console.log(long);

		//then the add marker function calls from the lat/long array to plug in the lat and long and creates the marker..

		addMarker({lat:lat[i], lng:long[i]})
		console.log(markers);
		restaurants++
		info++
		}

	}


		});

	});

});

	}


