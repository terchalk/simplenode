const express = require('express');
const bodyParser =  require('body-parser');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const app = express();

const TOKEN_PATH = 'token.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.post('/team', function(req, res) {
  let name = req.body.name;

  res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSdOSbvwTkpsezfCJQph8tJLDCjOsaKYvbwCkQwM43vdwqiedg/viewform?usp=pp_url&entry.1658505065=' + name);
});

app.listen(3000, function() {
  console.log("started!");
});
