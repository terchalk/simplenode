var express = require('express');
var app = express();

app.get('/about', function(req, res) {
	res.send('FeelsWeirdMan');
})

app.use(express.static(__dirname + "/public"));

app.listen(3000, function() {
	console.log("started :)");
});
