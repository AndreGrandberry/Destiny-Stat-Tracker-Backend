//auth.js

const express = require('express');
const router = express.Router();
const { handleOAuthCallback } = require('../controllers/authController');

// Route for initiating the OAuth flow


// This acts as the redirect URI. When using a redirectURI with BUNGIE, the connetion MUST BE SECURE.
// For this we make use of ngrok for our URLS.
router.get('/callback', handleOAuthCallback);

module.exports = router;
  