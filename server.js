var express = require('express');
var app = express();
var bodyParser =  require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.post('/team', function(req, res) {
	let name = req.body;
	console.log(JSON.stringify(name));
	res.send("Received!");
});

app.listen(3000, function() {
	console.log("started :)");
});
