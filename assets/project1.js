var map;
var restaurantName = [];
var restaurantAddress = [];
var markers = [];
var contentString = [];
var infowindows = [];
var loading = false;
var rows = 1;
var dataZero = [];
var dataOne = [];
var dataTwo = [];


//this function initializes the google map on the screen

function initMap() {
	var options = {
		zoom: 9,
		center: {lat: 29.7604, lng: -95.3698}
	};

	map = new google.maps.Map(document.getElementById('map'), options);


	//This function allows you to plug in coordinates and it'll generate a marker on the map
	function addMarker(coords, restInfo) {
		var marker = new google.maps.Marker({
			position: coords,
			map: map
		});

		markers.push(marker);

		var infowindow = new google.maps.InfoWindow({
          content: restInfo
        });

		contentString.push(infowindow);

    
		marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
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


	var userLat = [];
	var userLong = [];
	var box = 1;
	var border = 1;



	$("#random").submit(function(event) {
		event.preventDefault();	
		var userAddress = $("#input").val().trim();
		var userDistance = $("#distance").val().trim();
		$("#error").empty();


		if (userAddress === "") {
			$("#error").html("<br>You must enter a location before clicking submit");
		} 

		else {

			//I have NO clue how this even works.. found it online on stack overflow... LOL https://stackoverflow.com/questions/7499862/how-to-geocode-an-address-into-lat-long-with-google-maps
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'address': userAddress}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
			 			map.setCenter(results[0].geometry.location);
			 			userLat.push(results[0].geometry.location.lat());
			 			userLong.push(results[0].geometry.location.lng());
			 			console.log(results[0].geometry.location.lat());
			 			console.log(results[0].geometry.location.lng());
			 			console.log(userLat);
			 			console.log(userLong);
			 			}
				else {
					$("#error").html("<br>Geocode was not successful for the following reason: " + status + " Please try again");
					}



			var queryURL1 = "https://developers.zomato.com/api/v2.1/cuisines?lat=" + userLat + "&lon=" + userLong;
			var api_key = "c401c9eff451fccdbc6ac1dbacaa0e55";
			var cuisineList = [];
			var lat = [];
			var long = [];
			var restaurants = 1;
			var info;
			

		// this first ajax gets the cuisine list from zomato and pushes it into the array of cuisineList
		if (loading === true){
			$("");
		}
		else{
			$.ajax({
				url: queryURL1,
				headers: { 'user-key': api_key },
				method: "GET"
			}).done(function(response)
			{

				loading = true;

				for (var i = 0; i < response.cuisines.length; i++) {
					cuisineList.push(response.cuisines[i].cuisine.cuisine_name);
				}

				// console.log(cuisineList);

				//When you click on this button with the ID of random...
		 			
			   		
				// .. it gets a random string from the cuisineList array using the Math.random()..
				var cuisineRandom = cuisineList[Math.floor(Math.random() * cuisineList.length)];
				// .. then it adds the text of whatever cuisine it chose to the HTML page.. entity_type=city&
				$("#cuisine").text(cuisineRandom);
				var queryURL2 = "https://developers.zomato.com/api/v2.1/search?q=" + cuisineRandom + "&radius=" + userDistance + "000&count=3&lat=" + userLat + "&lon=" + userLong + "&sort=real_distance&sort=rating";
				lat = [];
				long = [];
				restaurantName = [];
				restaurantAddress = [];
				infowindows = [];
				contentString = [];
				restaurants = 1;
				info = 1;
				box = 1;
				dataZero = [];
				dataOne = [];
				dataTwo = [];
				// console.log(queryURL2);

				deleteMarkers();

				// then it calls another ajax function that uses the queryURL2 up above and utilizes the random cuisine it chose in its search to find 5 restaurants that are related to that cuisine...

				$.ajax({
					url: queryURL2,
					headers: { 'user-key': api_key },
					method: "GET"
					}).done(function(response)
					{
							//this creates an initial JSON response to find what information you need
							console.log(response.restaurants);

							border = 1;
							box = 1;

							for (var i = 0; i < 3; i++) {

								$("#border" + border).addClass("box" + box);
								$(".animated").removeClass();
								$(".jello").removeClass();
								box++;
								border++;

							}

							


							if (response.restaurants.length === 0) {

								box = 1;

								for (i = 0; i < 3; i++) {

									$("#restaurant-" + restaurants).html("");

									$("#info-" + info).html("");

									$(".box" + box).removeClass();

									info++;
									restaurants++;
									box++;
					
								}

								$("#restaurant-" + 2).text("No Restaurants Found. Try Again!");

							}


							else if (response.restaurants.length === 1) {

								// for (var i = 0; i < 2; i++) {

									$("#restaurant-" + 1).text("");
									$(".box" + 1).removeClass();
									$("#info-" + 1).html("");

									$("#restaurant-" + 3).text("");
									$(".box" + 3).removeClass();
									$("#info-" + 3).html("");

								// 	info++
								// 	restaurants++

								// }

								for (i = 0; i < 1; i++) {

									$("#restaurant-" + 2).text(response.restaurants[i].restaurant.name);

										
									$("#info-" + 2).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
									"<p><strong>Rating:</strong> " + response.restaurants[i].restaurant.user_rating.aggregate_rating + "</p>" +
									"<p><strong>Rank:</strong> " + response.restaurants[i].restaurant.user_rating.rating_text + "</p>" +
									"<p><strong>Number Of Votes:</strong> " + response.restaurants[i].restaurant.user_rating.votes + "</p>");

									lat.push(parseFloat(response.restaurants[i].restaurant.location.latitude));
									long.push(parseFloat(response.restaurants[i].restaurant.location.longitude));

									restaurantName.push(response.restaurants[i].restaurant.name);
									restaurantAddress.push(response.restaurants[i].restaurant.location.address);
									infowindows.push("<h4>Restaurant:</h4><strong>" + restaurantName[i] + "</strong><h4>Address:</h4><strong>" + restaurantAddress[i] + "</strong><br><h5>Menu/Reviews: </h5><a href='" + response.restaurants[i].restaurant.url + "' target='_blank'> More Info </a>");
									// console.log(restaurantName);
									// console.log(restaurantAddress);

									//then the add marker function calls from the lat/long array to plug in the lat and long and creates the marker..
									addMarker({lat:lat[i], lng:long[i]}, infowindows[i]);

								}
								dataOne.push(cuisineRandom, response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.average_cost_for_two, response.restaurants[0].restaurant.user_rating.aggregate_rating, response.restaurants[0].restaurant.user_rating.rating_text, response.restaurants[0].restaurant.user_rating.votes);
							}

							else if (response.restaurants.length === 2) {

								restaurants = 2;
								info = 2;
								box = 2;

								for (i = 0; i < 1; i++) {

									$("#restaurant-" + restaurants).text("");
									$(".box" + box).removeClass();

									$("#info-" + info).html("");

									info++;
									restaurants++;
									box++;

								}

								restaurants = 1;
								info = 1;
								box = 1;

								for (i = 0; i < 2; i++) {

									if (i === 1) {
										restaurants++;
										info++;
										box++;
									}

									else {

									$("#restaurant-" + restaurants).text(response.restaurants[i].restaurant.name);

					
									$("#info-" + info).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
									"<p><strong>Rating:</strong> " + response.restaurants[i].restaurant.user_rating.aggregate_rating + "</p>" +
									"<p><strong>Rank:</strong> " + response.restaurants[i].restaurant.user_rating.rating_text + "</p>" +
									"<p><strong>Number Of Votes:</strong> " + response.restaurants[i].restaurant.user_rating.votes + "</p>");

									lat.push(parseFloat(response.restaurants[i].restaurant.location.latitude));
									long.push(parseFloat(response.restaurants[i].restaurant.location.longitude));

									restaurantName.push(response.restaurants[i].restaurant.name);
									restaurantAddress.push(response.restaurants[i].restaurant.location.address);
									infowindows.push("<h4>Restaurant:</h4><strong>" + restaurantName[i] + "</strong><h4>Address:</h4><strong>" + restaurantAddress[i] + "</strong><br><h5>Menu/Reviews: </h5><a href='" + response.restaurants[i].restaurant.url + "' target='_blank'> More Info </a>");
									// console.log(restaurantName);
									// console.log(restaurantAddress);
									
									//then the add marker function calls from the lat/long array to plug in the lat and long and creates the marker..
									addMarker({lat:lat[i], lng:long[i]}, infowindows[i]);
									}
								}

								dataZero.push(cuisineRandom, response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.average_cost_for_two, response.restaurants[0].restaurant.user_rating.aggregate_rating, response.restaurants[0].restaurant.user_rating.rating_text, response.restaurants[0].restaurant.user_rating.votes);
								dataTwo.push(cuisineRandom, response.restaurants[1].restaurant.name, response.restaurants[1].restaurant.average_cost_for_two, response.restaurants[1].restaurant.user_rating.aggregate_rating, response.restaurants[1].restaurant.user_rating.rating_text, response.restaurants[1].restaurant.user_rating.votes);
							}
							else {

								for (i = 0; i < response.restaurants.length; i++) {

									$("#restaurant-" + restaurants).text(response.restaurants[i].restaurant.name);
									$("#restaurant-" + restaurants).addClass("animated jello");

									//then it runs through this for loop creating a console.log for each of the 3 restaurants...

									$("#info-" + info).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
									"<p><strong>Rating:</strong> " + response.restaurants[i].restaurant.user_rating.aggregate_rating + "</p>" +
									"<p><strong>Rank:</strong> " + response.restaurants[i].restaurant.user_rating.rating_text + "</p>" +
									"<p><strong>Number Of Votes:</strong> " + response.restaurants[i].restaurant.user_rating.votes + "</p>");
									// console.log("Latitude: " + response.restaurants[i].restaurant.location.latitude);
									// console.log("Longitude: " + response.restaurants[i].restaurant.location.longitude);
									// console.log("Image: " + response.restaurants[i].restaurant.photos_url)

									//we then are pushing the float number (decimal number) into the lat/long array...

									lat.push(parseFloat(response.restaurants[i].restaurant.location.latitude));
									long.push(parseFloat(response.restaurants[i].restaurant.location.longitude));
									contentString.push();

									// console.log(lat);
									// console.log(long);
									
									restaurantName.push(response.restaurants[i].restaurant.name);
									restaurantAddress.push(response.restaurants[i].restaurant.location.address);
									infowindows.push("<h4>Restaurant:</h4><strong>" + restaurantName[i] + "</strong><h4>Address:</h4><strong>" + restaurantAddress[i] + "</strong><br><h5>Menu/Reviews: </h5><a href='" + response.restaurants[i].restaurant.url + "' target='_blank'> More Info </a>");
									// console.log(restaurantName);
									// console.log(restaurantAddress);

									//then the add marker function calls from the lat/long array to plug in the lat and long and creates the marker..
									addMarker({lat:lat[i], lng:long[i]}, infowindows[i]);
									// console.log(markers);
									// console.log(contentString);
									restaurants++;
									info++;
								}

									dataZero.push(cuisineRandom, response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.average_cost_for_two, response.restaurants[0].restaurant.user_rating.aggregate_rating, response.restaurants[0].restaurant.user_rating.rating_text, response.restaurants[0].restaurant.user_rating.votes);
									dataOne.push(cuisineRandom, response.restaurants[1].restaurant.name, response.restaurants[1].restaurant.average_cost_for_two, response.restaurants[1].restaurant.user_rating.aggregate_rating, response.restaurants[1].restaurant.user_rating.rating_text, response.restaurants[1].restaurant.user_rating.votes);
									dataTwo.push(cuisineRandom, response.restaurants[2].restaurant.name, response.restaurants[2].restaurant.average_cost_for_two, response.restaurants[2].restaurant.user_rating.aggregate_rating, response.restaurants[2].restaurant.user_rating.rating_text, response.restaurants[2].restaurant.user_rating.votes);

									// console.log(dataZero);
									// console.log(dataOne);
									// console.log(dataTwo);															
							}				


								loading = false;
							});

						userLat = [];
						userLong = [];

					});
				window.scrollTo(0,document.body.scrollHeight);
				loading = false;
				}				
 			});
		}
	});

		$(".click1").unbind("click").on("click", function () {
			var tableRow = $("<tr>");
			// tableRow.attr("data-rest", "rest" + rows)
			// tableRow.attr("id", "row-" + rows)
			tableRow.addClass("userRemove");
			$("#main").append(tableRow);

				for (i = 0; i < dataZero.length; i++) {
			
					var tableData = $("<td>");
					tableData.html(dataZero[i]);

				tableRow.append(tableData);

			}

			userRemove();
			dataZero = [];
			
			rows++;
		  
		});

		$(".click2").unbind("click").on("click", function () {
			var tableRow = $("<tr>");
			// tableRow.attr("data-rest", "rest" + rows)
			// tableRow.attr("id", "row-" + rows)
			tableRow.addClass("userRemove");
			$("#main").append(tableRow);

				for (i = 0; i < dataOne.length; i++) {
			
					var tableData = $("<td>");
					tableData.text(dataOne[i]);

				tableRow.append(tableData);

			}
			userRemove();
			dataOne = [];
			rows++;
		  
		});

		$(".click3").unbind("click").on("click", function () {
			var tableRow = $("<tr>");
			// tableRow.attr("data-rest", "rest" + rows)
			// tableRow.attr("id", "row-" + rows)
			tableRow.addClass("userRemove");
			$("#main").append(tableRow);

				for (i = 0; i < dataTwo.length; i++) {
			
					var tableData = $("<td>");
					tableData.html(dataTwo[i]);

				tableRow.append(tableData);

			}
			
			
			userRemove();
			dataTwo = [];
			rows++;
		  
		});
 	
}


function userRemove () {
	$(".userRemove").off().on("click", function(){

			var remove = confirm("Do you want to remove?");

			if (remove === true) {

				$(this).remove();
			}

			else {
				return false;
			}

		});
}

userRemove();

	






// user inputs address and clicks a button
// then once the button is clicked.. it make an ajax call for the geocode lat and long
// aka response.results.geometry.lat and response.results.geometry.long
// once the code grabs those responses, it will then push into the variable userLat and userLong
// which then would be populated onto the queryURL2 variable