const express = require('express');
const bodyParser =  require('body-parser');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = 
[
  "https://www.googleapis.com/auth/script.projects",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/forms"
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.post('/team', function(req, res) {
  let name = req.body.name;

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);

    const {client_secret, client_id, redirect_uris} = JSON.parse(content).web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        return getAccessToken(oAuth2Client);
      } else {
        oAuth2Client.setCredentials(JSON.parse(token));
        callAppScript(oAuth2Client, name).then(() => {
          res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSdOSbvwTkpsezfCJQph8tJLDCjOsaKYvbwCkQwM43vdwqiedg/viewform?usp=sf_link');
        }).catch(() => {
          console.log('google scripts error');
        }); 
      }
    });
  });
});

app.listen(3000, function() {
  console.log("started!");
});

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

function callAppScript(auth, name) {
  const scriptId = '11jQnbvTIG_ov5Y-E4M4T2yzKvOMIvVT_Gu24ba1AMYW0Z24LTM767HRn';
  const script = google.script('v1');
  
  return new Promise((resolve, reject) => {
   script.scripts.run({
      auth: auth,
      resource: {
        function: 'changeFormTitle',
        parameters: [
          name
        ],
      },
      scriptId: scriptId,
    }, function(err, resp) {
      if (err) {
        // The API encountered a problem before the script started executing.
        console.log('The API returned an error: ' + err);
        reject();
      }

      resolve();
    });   
  })
}
