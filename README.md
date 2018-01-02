# UpForWhatever

## About


UpForWhatever is an application which helps the indecisive user decide on what and where they should eat! 

It takes user input by asking for a location (address, city, state, or zip) then it quickly looks up all the cuisines in your area and chooses 1 at random. Once the application chooses a cuisine for you, it will generate up to 3 restaurants randomly for the user to decide and pick from!

The application utilizes 2 API's: Google Maps and Zomato. 

Google Maps is used to specify location based on the user input. For example, if the user inputs 20895, it will zoom to that location and generate a lat and long based on that location and plug it into the Zomato API which will get the random cuisine and the restaurants for the indecisive user.

The program then will get the lat/long for each restaraunt and create a marker on the map for the user to click on if needed.

If the user is unhappy with the applications choices, you can simply just click the "Let's Go" button again, and it will choose another random cuisine and more restaurants.

The Zomato API will pull up to 10 different restaraunts based on the cuisine and choose 3 at random from that list of 10. We programmed it this way because originally, the application would choose the same 3 restaraunts everytime the same cuisine came up. This now allows more choices for the user.

