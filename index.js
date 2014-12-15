var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var bcrypt = require('bcrypt');
var db = require('./models/index.js');
var request = require('request');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: "something",
    resave: false,
    saveUninitialized: true
}));

// app.use(function (req, res, next) {
//     req.getUser() = function() {
//         return req.session.user || false;
//     }
//     next();
// });



app.get("/", function (req, res) {
    res.render('homepage');
});

app.get("/search", function (req, res) {
	var countryName = req.query.country;
	request("http://restcountries.eu/rest/v1/name/" + countryName, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			JSONObject results = new JSONObject();
			var oldArray = req.body;
			results.put("newArray", oldArray);
			
			res.send(results);
			// res.render("search", {test: body});
		}
	})
});







app.listen(3000);






