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

        // $(".moreInfo").on("click")
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
	
	// Initialize Firebase
	var config = {
	apiKey: "AIzaSyCTCocVgeQd6pAtW5uB39sORxD4ofZ43FY",
	authDomain: "upforwhatever-ff19e.firebaseapp.com",
	databaseURL: "https://upforwhatever-ff19e.firebaseio.com",
	projectId: "upforwhatever-ff19e",
	storageBucket: "",
	messagingSenderId: "631460305340"
	};
	firebase.initializeApp(config);

	var database = firebase.database();


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
			 			// console.log(results[0].geometry.location.lat());
			 			// console.log(results[0].geometry.location.lng());
			 			// console.log(userLat);
			 			// console.log(userLong);
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


									info++;
									restaurants++;
									box++;
					
								}
								$(".box" + 1).removeClass();
								$(".box" + 3).removeClass();
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
								dataOne.push(cuisineRandom, response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.user_rating.rating_text, "<a target='_blank' href='" + response.restaurants[0].restaurant.url + "'>More Info</a>");
							}

							else if (response.restaurants.length === 2) {

								// restaurants = 2;
								// info = 2;
								// box = 2;

								

									$("#restaurant-" + 2).text("");
									$(".box" + 2).removeClass();

									$("#info-" + 2).html("");

									// info++;
									// restaurants++;
									// box++;

								

								// restaurants = 1;
								// info = 1;
								// box = 1;

								for (i = 0; i < 1; i++) {

								// 	if (i === 1) {
								// 		restaurants++;
								// 		info++;
								// 		box++;
								// 	}

									// else {

									$("#restaurant-" + 1).text(response.restaurants[i].restaurant.name);

					
									$("#info-" + 1).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
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
								// }

										for (i = 1; i < 2; i++) {

								// 	if (i === 1) {
								// 		restaurants++;
								// 		info++;
								// 		box++;
								// 	}

									// else {

									$("#restaurant-" + 3).text(response.restaurants[i].restaurant.name);

					
									$("#info-" + 3).html("<p><strong>Average Cost For Two:</strong> " + response.restaurants[i].restaurant.average_cost_for_two + "</p>" +
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
								// }

								dataZero.push(cuisineRandom, response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.user_rating.rating_text, "<a target='_blank' href='" + response.restaurants[0].restaurant.url + "'>More Info</a>");
								dataTwo.push(cuisineRandom, response.restaurants[1].restaurant.name, response.restaurants[1].restaurant.user_rating.rating_text, "<a target='_blank' href='" + response.restaurants[1].restaurant.url + "'>More Info</a>");
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

									dataZero.push(cuisineRandom, response.restaurants[0].restaurant.name, response.restaurants[0].restaurant.user_rating.rating_text, "<a target='_blank' href='" + response.restaurants[0].restaurant.url + "'>More Info</a>");
									dataOne.push(cuisineRandom, response.restaurants[1].restaurant.name, response.restaurants[1].restaurant.user_rating.rating_text, "<a target='_blank' href='" + response.restaurants[1].restaurant.url + "'>More Info</a>");
									dataTwo.push(cuisineRandom, response.restaurants[2].restaurant.name, response.restaurants[2].restaurant.user_rating.rating_text, "<a target='_blank' href='" + response.restaurants[2].restaurant.url + "'>More Info</a>");

									// console.log(dataZero);
									// console.log(dataOne);
									// console.log(dataTwo);															
							}				


								loading = false;
							});

						userLat = [];
						userLong = [];

					});
				window.scrollTo(0, 500);
				//document.body.scrollHeight
				loading = false;
				}				
 			});
		}
	});

		$(".click1").unbind("click").on("click", function () {

			if (dataZero.length === 0) {
				return false;
			}
			else {
				database.ref().push({
					Cuisine: dataZero[0],
					Restaurant_Name: dataZero[1],
					Rank: dataZero[2],
					MoreInfo: dataZero[3]
					// Rating: dataZero[3],
					// Rank: dataZero[4],
					// Votes: dataZero[5]
				});
			}

			// window.scrollTo(0, document.body.scrollHeight);
				//document.body.scrollHeight
			userRemove();
			dataZero = [];
			
		  
		});

		$(".click2").unbind("click").on("click", function () {

			if (dataOne.length === 0) {
				return false;
			}
			else {
				database.ref().push({
					Cuisine: dataOne[0],
					Restaurant_Name: dataOne[1],
					Rank: dataOne[2],
					MoreInfo: dataOne[3]
					// Rating: dataOne[3],
					// Rank: dataOne[4],
					// Votes: dataOne[5]
				});
			}

			userRemove();
			// window.scrollTo(0, document.body.scrollHeight);
			dataOne = [];
			
		  
		});

		$(".click3").unbind("click").on("click", function () {

			if (dataTwo.length === 0) {
				return false;
			}
			else {
				database.ref().push({
					Cuisine: dataTwo[0],
					Restaurant_Name: dataTwo[1],
					Rank: dataTwo[2],
					MoreInfo: dataTwo[3]
					// Rating: dataTwo[3],
					// Rank: dataTwo[4],
					// Votes: dataTwo[5]
				});
			}
			
			userRemove();
			// window.scrollTo(0, document.body.scrollHeight);
			dataTwo = [];
			
		  
		});


		database.ref().on("child_added", function(snapshot) { 

			input = [snapshot.val().Cuisine, snapshot.val().Restaurant_Name, snapshot.val().Rank, snapshot.val().MoreInfo, "<button class='userRemove close text-center'>Remove</button>"];
			var key = snapshot.key;
			var tableRow = $("<tr>");
			tableRow.attr("data-key", key)
			tableRow.attr("id", "row-" + rows)
			tableRow.addClass("dataInRows");
			$("#main").append(tableRow);

				for (var i = 0; i < 5; i++) {

					var tableData = $("<td>");
					// tableData.addClass("text-center")
					tableData.html(input[i]);

					tableRow.append(tableData);

				}

				rows++;
				userRemove();
				console.log(key)
		})
 	
}



var Restaurant_Name;

function userRemove () {
	$(".userRemove").off().on("click", function(){

			var remove = confirm("Do you want to delete from your favorites?");

			if (remove === true) {

				var firebaseRemove = $(this).closest('tr').attr("data-key")

				firebase.database().ref().child(firebaseRemove).remove()


				$(this).closest('tr').remove();
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