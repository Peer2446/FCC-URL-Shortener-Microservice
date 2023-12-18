require('dotenv').config();
const dns = require('dns')
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

let urlCounter = 0;
const urlDatabase = {}; // Store original and short URLs

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = `${urlCounter}`;
  urlDatabase[urlCounter] = originalUrl;
  urlCounter++;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrlIndex = req.params.short_url;

  // Check if the short URL exists in the database
  if (!urlDatabase[shortUrlIndex]) {
    return res.json({ error: 'short url not found' });
  }

  // Redirect to the original URL
  res.redirect(urlDatabase[shortUrlIndex]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
