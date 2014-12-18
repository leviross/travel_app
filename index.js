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

	// req.session.user = {
	// 	name: 'Levi',
	// 	id: 4,
	// 	email: 'levross@gmail.com'
	// };

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
	res.locals.background = 'http://t.wallpaperweb.org/wallpaper/nature/1920x1080/rockymountains1920x1080wallpaper3354.jpg';
	next();
});

app.get("/", function (req, res) {
	res.render("homepage");
});


app.get("/search", function (req, res) {
	var countryName = req.query.country;
	
	res.locals.background = "http://www.mrwallpaper.com/wallpapers/tropical-beach-sunset-hd.jpg";
	request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var stuff = JSON.parse(body);
			if(Array.isArray(stuff) && stuff.length > 0) {
				res.render("search", {test: stuff});	
			}else {

			//TODO: MAKE THIS INTO RES RENDER LATER
			res.send("some error message that i need to work on");
		}
	}else {
		res.render("countryNotFound");
	}
	
});
});
app.get("/show/:id", function (req, res) {
	var user = req.getUser();
	res.locals.background = "http://woliper.com/wp-content/uploads/2014/07/nyc-wallpaper-sunset-sunsethdwallpaper-hd-black-and-white-skyline-winter-at-night-wallpapers-patch-new-york-city-1920x1200-wall-paper-for-bedroom-backgrounds.jpg";
	var countryName = req.params.id;
	request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var stuff2 = JSON.parse(body);
			if(Array.isArray(stuff2) && stuff2.length > 0) {

				db.place.find({where:{name:countryName,userId:user.id}}).then(function(place){

					var isInFavList = !!place;
					var placeId = isInFavList ? place.id : 0;

					var showArray = stuff2[0];
					res.render("show", {test:showArray,isInFavList:isInFavList,placeId:placeId});
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
		where: {name: req.body.name},
		defaults: {name: req.body.name, capital: req.body.capital, userId: user.id, lat:req.body.lat, lng:req.body.lng}
	}).spread( function (user, created) {
		res.send({wasItCreated:created});
		// if(created) {
		// 	req.flash("info", "This country has been added to your favorite places!");

		// }else {
		// 	req.flash("warning", "You already added this country to your favorite places.");
		// }

	});
	// res.render("favplaces", )
});
app.get("/favplaces", function (req, res) {
	var user = req.getUser();
	res.locals.background = "http://www.99hdwallpaper.com/beautiful/wallpapers/most-beautiful-nature-wallpaper.jpg";
	db.place.findAll({where: {userId: user.id}}).done(function (error, data) {
			res.render("favplaces", {'place':data});//can i pass my api to the page in addition to the database info???
			//i want to loop through all my fav places and put a marker on the map for each 
			//if not, should i add my latlng to my database places so i can render that to favplaces and loop through? 
			// res.send({'place':data});
		})
});

app.get("/login", function (req, res) {
	res.locals.background = "http://4.bp.blogspot.com/-nM2RQQp6Pj0/U2OPr-6Bn-I/AAAAAAAAIhw/dm50JhtrHRs/s1600/magnificent-swiss-alps-snowy-mountains-nature-wallpaper.png";
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
		defaults: {email: req.body.email, name: req.body.name, password: req.body.password}
	}).spread(function (user, created) {
		if (created) {
			req.flash("info", "Welcome to Travel World!");
			res.redirect("/");
		} else {
			req.flash("warning", "You have already signed up for an account, please login.");
			res.redirect("/login");
		}

	}).catch(function (error) {
		if (error && Array.isArray(error.errors)) {
			error.errors.forEach(function (errorItem) {
				req.flash("danger", errorItem.message);
			});
		} else {
			req.flash("danger", "Unknown Error");
		}
		res.redirect("/signup");
	});
});
app.post("/reviews", function (req, res) {
	res.locals.background = "https://tse3.mm.bing.net/th?id=HN.607992607286756075&pid=1.7";
	var user = req.getUser();
	// ad.place.find()
	db.review.create({placeId: req.body.pid,userId: user.id, content: req.body.message})
	.then(function(review) {
		// res.send(review);
		// res.render("reviews", {garbage:review});
		// alert("Thanks for posting your experience!");
		res.redirect("/reviews/"+req.body.pid);

	})
});
app.get("/reviews/:pid", function (req, res) {
	res.locals.background = "http://travelsinfo.net/images/kilimanjaro.jpg";
	var user = req.getUser();
	var id = req.params.pid;
	db.place.find(id).then(function (place) {
		var thisCountry = place.name;
		db.review.findAll({where: {userId: user.id, placeId: req.params.pid}}).then(function (reviews) {
			res.render("reviews", {reviewsArray:reviews, thisCountry:thisCountry});
		})
	});
	
});
app.get("/allreviews", function (req, res) {
	res.locals.background = "http://skillcode.files.wordpress.com/2013/01/beautiful-beach-morning-skillcode.jpg";
	var user = req.getUser();
	db.review.findAll({
		where: {userId: user.id},
		include: [{model:db.place}]
	}, {order: 'updatedAt DESC'}).done(function (error, reviews) {
			// res.send(reviews);
			res.render("allreviews", {reviews:reviews});

			// res.send({contentOf:contentOf, reviewOf:reviewOf});

	})

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



app.listen(process.env.PORT || 3000);






