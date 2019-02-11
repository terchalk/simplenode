const express = require('express');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const bodyParser =  require('body-parser');

const app = express();

let participantName = ""

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.post('/team', function(req, res) {
	let name = req.body;
	console.log(JSON.stringify(name));
	participantName = req.body;

	res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSdOSbvwTkpsezfCJQph8tJLDCjOsaKYvbwCkQwM43vdwqiedg/viewform?usp=sf_link');
});

app.listen(3000, function() {
	console.log("started :)");
});


