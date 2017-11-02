function initMap() {
	var options = {
		zoom: 9,
		center: {lat: 29.7604, lng: -95.3698}
	}

	var map = new google.maps.Map(document.getElementById('map'), options)

	
	//This function allows you to plug in coordinates and it'll generate a marker on the map
	function addMarker(coords) {
		var marker = new google.maps.Marker({
			position: coords,
			map: map
		})
	}

	//example of using addMarker()
	addMarker({lat:29.9600004, lng:-95.5388644})

}

$(document).ready(function(){

	// API Website https://developers.zomato.com/documentation#!/restaurant/search

var queryURL1 = "https://developers.zomato.com/api/v2.1/cuisines?city_id=277&lat=29.7604&lon=-95.3698"
var api_key = "c401c9eff451fccdbc6ac1dbacaa0e55"
var cuisineList = [];
	
	$.ajax({
		url: queryURL1,
		headers: { 'user-key': api_key },
		method: "GET"
	}).done(function(response){

		for (var i = 0; i < response.cuisines.length; i++) {
		cuisineList.push(response.cuisines[i].cuisine.cuisine_name);
	}

		console.log(cuisineList);


 	$("#random").on("click", function() {

		var cuisineRandom = cuisineList[Math.floor(Math.random() * cuisineList.length)];
		console.log(cuisineRandom)
		var queryURL2 = "https://developers.zomato.com/api/v2.1/search?entity_type=city&q=" + cuisineRandom + "&count=5&lat=29.7604&lon=-95.3698&radius=5000&cuisines=" + cuisineRandom + "&sort=real_distance"


	$.ajax({
		url: queryURL2,
		headers: { 'user-key': api_key },
		method: "GET"
	}).done(function(response) {

		console.log(response);

		for (var i = 0; i < response.restaurants.length; i++) {

		console.log("Restaurant Name: " + response.restaurants[i].restaurant.name);
		console.log("Average Cost For Two: " + response.restaurants[i].restaurant.average_cost_for_two);
		console.log("Image: " + response.restaurants[i].restaurant.photos_url);
		console.log("Rating: " + response.restaurants[i].restaurant.user_rating.aggregate_rating);
		console.log("Rank: " + response.restaurants[i].restaurant.user_rating.rating_text);
		console.log("Number Of Votes: " + response.restaurants[i].restaurant.user_rating.votes);
		}

		});

	});

});


        	

		// $("#bars").on("click", function() {

		// 	// .html() the top 5 bars in the houston area

		// })

		// $("#nightlife").on("click", function() {

		// 	// .html() the top 5 clubs in the houston area

		// })

		// $("#restaurants").on("click", function() {

		// 	// .html() the top 5 restaurants in the houston area
			
		// })





});