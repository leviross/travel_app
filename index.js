var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();
var bcrypt = require("bcrypt");
var db = require("./models/index.js");
var request = require("request");
var flash = require("connect-flash");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
	secret: "something",
	resave: false,
	saveUninitialized: true
}));

app.use(flash());
app.use(function (req, res, next) {


	//////////////////////////////// AUTO LOG IN DELETE THIS LATER!!!!

	req.session.user = {
		name: 'levi',
		id: 19,
		email: 'levross@gmail.com'
	};

	////////////////////////////////


	req.getUser = function() {
		return req.session.user || false;
	}
	next();
});
app.get("*", function (req, res, next) {
	var alerts = req.flash();
	res.locals.alerts = alerts; 
	res.locals.user = req.getUser();
	res.locals.background = 'http://i.imgur.com/7BrsI0F.png';//Deleted route images, kept this for white 
	next();
});

app.get("/", function (req, res) {
	res.render("homepage");
});
app.get("/aboutme", function (req, res) {
	res.render("aboutme");
});


app.get("/search", function (req, res) {
	var countryName = req.query.country;
		request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var countryListData = JSON.parse(body);
				if(Array.isArray(countryListData) && countryListData.length > 0) {
					res.render("search", {countryArray: countryListData});	
				}else {

				//TODO: MAKE THIS INTO RES RENDER LATER
				res.send("some error message that i need to work on");
				}
			}else {
				//if user searched for name that doesnt match anything
				req.flash("danger", "Invalid country name, please search again.");
				res.redirect("/");
			}
	
	});
});

app.get("/show/:id", function (req, res) {
	var user = req.getUser();
	var countryName = req.params.id;
	request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var countryListArray = JSON.parse(body);
			if(Array.isArray(countryListArray) && countryListArray.length > 0) {

				db.place.find({where:{name:countryName,userId:user.id}}).then(function(place){

					var isInFavList = !!place;
					var placeId = isInFavList ? place.id : 0;

					var finalArray = countryListArray[0];
					res.render("show", {showArray:finalArray,isInFavList:isInFavList,placeId:placeId});
				});
			}else {
				//TODO: MAKE THIS INTO RES RENDER LATER
				res.send("we found no country by that name")
			}
		}else {
			res.render("countryNotFound");
		}
	});

});
app.post("/favplaces", function (req, res) {
	var user = req.getUser();
	db.place.findOrCreate(
	{
		where: {name: req.body.name, userId: user.id},
		defaults: {name: req.body.name, capital: req.body.capital, userId: user.id, lat:req.body.lat, lng:req.body.lng}
	}).spread( function (user, created) {
		// ON MY SCRIPT PAGE, THIS IS POSTED TO DB VIA AJAX, ROUTE ENDS HERE
		res.send({wasItCreated:created});
		// if(created) {
		// 	req.flash("info", "This country has been added to your favorite places!");

		// }else {
		// 	req.flash("warning", "You already added this country to your favorite places.");
		// }

	});
	// res.render("favplaces", )
});

// ADDED reviews MODEL TO THIS ROUTE NOW SO I CAN SHOW REVIEWS ATTACHED TO EACH COUNTRY ON ITS MARKER
app.get("/favplaces", function (req, res) {
	var user = req.getUser();
	db.review.findAll({
		where: {userId: user.id},
		include: [{model:db.place}]
	}).done(function (error, bothModels) {
			res.render("favplaces", {reviewsAndPlaces:bothModels});
		});
});
app.get("/worldmap", function (req, res) {
	var user = req.getUser();
	db.review.findAll({
		where: {userId: user.id},
		include: [{model:db.place}]
	}).done(function (error, reviews) {
		if(error){
			return next(error);
		}
			//IF USER HASNT MADE ANY REVIEWS, 302 ERROR WILL HAPPEN, WILL REDIRECT TO HOMEPAGE
			// res.send(reviews);
			res.render("worldmap", {reviewsAndPlaces:reviews});
		});
	// res.render("worldmap");
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.post("/login", function (req, res) {
	db.user.find({where: {email: req.body.email}}).then(function (userObj) {
		if (userObj) {
			bcrypt.compare(req.body.password, userObj.password, function (err, match) {
				if(match === true) {
					//store user object in session
					req.session.user = {
						name: userObj.name,
						id: userObj.id,
						email: userObj.email
					};
					//commented req.flash out cuz user is welcomed on homepage.ejs
					// req.flash("info", "Welcome back! Have Fun Exploring the World!");
					res.redirect("/");
				}else {
					req.flash("danger", "Please enter your correct password.");
					res.redirect("/login");
				}
			})	
		} else {
			req.flash("warning", "Please enter a correct user email.");
			res.redirect("/login");
		}		


	});
});

app.get("/signup", function (req, res) {
	res.render("signup");
});

app.post("/signup", function (req, res) {
	db.user.findOrCreate(
	{
		where: {email: req.body.email},
		defaults: {email: req.body.email, name: req.body.name, password: req.body.password, confirmed: req.body.confirmed}
	}).spread(function (user, created) {
			req.session.user = {
				name: user.name,
				id: user.id,
				email: user.email
			};
			req.flash("info", "Welcome to Travel World!");
			res.redirect("/");	
		// if (created) { - Originally this worked and just wouldnt keep login, but no errors.
		// 	req.getUser() = user; - Then I added this to keep logged in, it was going to else 2nd else statement, "Unknown" error.
		//  I tried using diff error handling like middleware method, didnt work. Then I commented all of this out.
		//  Now it all works, see comment below also.
		// 	req.flash("info", "Welcome to Travel World!");
		// 	res.redirect("/");
		// } else {
		// 	req.flash("warning", "You have already signed up for an account, please login.");
		// 	res.redirect("/login");
		// }
	}).catch(function (error) {
		if (error && Array.isArray(error.errors)) {
				error.errors.forEach(function (errorItem) {
					req.flash("danger", errorItem.message);
					res.redirect("/");
				});
		}else {
			// Was getting "Unknown error" a lot after adding above req.getUser to keep login, solved it with req.session
			// the if statement was adding user, but giving "Unknown" for some reason, it would go to the below else and 
			// give the error. 
			req.flash("danger", "Unknown Error");
			res.redirect("/signup");
		}
		
	});
});
app.post("/reviews", function (req, res) {
	var user = req.getUser();
	db.review.create({placeId: req.body.pid,userId: user.id, content: req.body.message})
	.then(function(review) {
		// res.send(review);
		// res.render("reviews", {garbage:review});
		// alert("Thanks for posting your experience!");
		// res.redirect("/reviews/"+req.body.pid);
		// instead of reviews/+req.body.pid page, im redirecting to favplaces with the review attached to marker
		res.redirect("/favplaces");

	});
});
// NOT USING THIS PAGE ANY LONGER, GOING STRAIGHT TO WORLD MAP WITH ALL REVIEWS ON MARKERS
// app.get("/reviews/:pid", function (req, res) {
// 	var user = req.getUser();
// 	var id = req.params.pid;
// 	db.place.find(id).then(function (place) {
// 		var thisCountry = place.name;
// 		db.review.findAll({where: {userId: user.id, placeId: req.params.pid}}).then(function (reviews) {
// 			res.render("reviews", {reviewsArray:reviews, thisCountry:thisCountry});
// 		});
// 	});
	
// });
app.get("/allreviews", function (req, res) {
	var user = req.getUser();
	db.review.findAll({
		where: {userId: user.id},
		include: [{model:db.place}]
	}, {order: 'updatedAt DESC'}).done(function (error, reviews) {
			// res.send(reviews);
			//if error, pass that to error handler at bottom, if no reviews, pass that to handler as well
			if(error) {
				// res.render("allreviews", {reviews:reviews});
				return next(error);
				// alert("error on 1st if statement");
			}
			if(reviews.length == 0) {
				var notFound = new Error("no such review");
				notFound.status = 404;
				// return next(notFound);
				//NO CLUE WHY WHEN NO REVIEWS AT ALL, IT WONT HIT THIS SECTION 
				req.flash("warning", "You have not posted experiences yet, please post and check again.");
				res.redirect("/");
			}

		// res.send(reviews);
		//NO CLUE WHY IM GETTING A 'CANNOT GET' ERROR WHEN I RENDER	
		res.render("allreviews", {reviewsArray:reviews});
		
		
	});

});


app.get("/logout", function (req, res) {
	delete req.session.user;
	req.flash("info", "You have been logged out.");
	res.redirect("/");
});
app.delete("/favplaces/:id", function (req , res) {
	db.place.find({where: {id: req.params.id}}).then(function(deleteCount){
		deleteCount.destroy().success(function(){
			res.send({deleted: deleteCount});
		})

	})
});
//error handling for all routes passing errors to error middleware	
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }

  res.status(404);
  // res.send(err.message || '** no unicorns here **');
  req.flash("danger", "That page doesnt exist, please try again.");
  res.redirect("/");
});
app.use(function(req, res, next){
  // res.send(404, 'Sorry cant find that!');
  req.flash("danger", "That page doesnt exist, please try again.");
  res.redirect("/");
});

app.listen(process.env.PORT || 3000);






