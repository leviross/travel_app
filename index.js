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
	request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var stuff = JSON.parse(body);
			if(Array.isArray(stuff) && stuff.length > 0) {
				res.render("search", {test: stuff});	
			}else {

			//TODO: MAKE THIS INTO RES RENDER LATER
				res.send("some error message that i need to work on")
			}
		}else {
			res.render("countryNotFound");
		}
	
	});
});
app.get("/show/:id", function (req, res) {
	var countryName = req.params.id;
	request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var stuff2 = JSON.parse(body);
			if(Array.isArray(stuff2) && stuff2.length > 0) {
				var showArray = stuff2[0];
				res.render("show", {test:showArray});
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
		defaults: {name: req.body.name, capital: req.body.capital, userId: user.id}
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
	db.place.findAll().done(function (error, data) {
			res.render("favplaces", {'place':data});
			// res.send({'place':data});
	})
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
		defaults: {email: req.body.email, name: req.body.name, password: req.body.password}
	}).spread(function (user, created) {
		if (created) {
			req.flash("info", "Welcome to My Travel App!");
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


app.get("/logout", function (req, res) {
	delete req.session.user;
	req.flash("info", "You have been logged out.");
	res.redirect("/");
});



app.listen(3000);






