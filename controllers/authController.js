
const axios = require('axios');
const db = require('../db');
const { OAUTH_CLIENT_SECRET, OAUTH_CLIENT_ID, BUNGIE_API_KEY } = require("../config");



const API_ROOT_PATH = 'https://www.bungie.net/Platform' 


// function to handle the OAuth flow
const handleOAuthCallback = async (req, res) => {
    try {
        
      
        const { code } = req.query; // Receive the authorization code from the query params
        
        const tokenEndpoint = `${API_ROOT_PATH}/app/oauth/token/`; 

        const basicAuth = Buffer.from(`${OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`).toString('base64'); // Exchange access code for and access token

        const tokenResponse = await axios.post(tokenEndpoint,
            `grant_type=authorization_code&code=${code}&client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&redirect_uri=https://surely-gentle-tiger.ngrok.io/auth/callback`,
            {
            
                headers:{
                    'Authorization':`Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  
                  
                }
            }
        );

        const { access_token } = tokenResponse.data;


        req.session.accessToken = access_token; // Take the access token from the response and store it in sessions
        
         
        // Use access token to get user data from the OAuth provider
        const userEndpoint = `${API_ROOT_PATH}/User/GetMembershipsForCurrentUser/`;

        const userResponse = await axios.get(userEndpoint, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'X-API-KEY': BUNGIE_API_KEY,
                
            },
        });

        // Extract necessary information from the response

        
        const { destinyMemberships } = userResponse.data.Response;

        const secondMembership = destinyMemberships[0];

        const displayName = userResponse.data.Response.bungieNetUser.uniqueName


        const { membershipId, crossSaveOverride } = secondMembership; // Acquire the override membershipId and crossSaveOveride from response


       

        // Save user data to the database
        const membershipType = crossSaveOverride; // Membershiptype/crossaveSaveOrride are data points that represent the primary console of the user

        const saveUserQuery = `
            INSERT INTO users (display_name, membership_type, membership_id)
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;

        try {
            const savedUser = await db.query(saveUserQuery, [displayName, membershipType, membershipId]); // Save all information extracted into database
            console.log('User saved to database:', savedUser.rows[0]);
        } catch (error) {
            console.error('Error saving user to database:', error);
        }

        req.session.membershipType = membershipType; //Using session as a failsafe
        req.session.membershipId = membershipId;
      
        

        res.redirect(`https://surely-gentle-tiger.ngrok.io/metrics`); // Redirect to route that handles fetching and storing API information
    } catch (error) {
        console.error('Error handling OAuth callback:', error);
        res.status(500).send('Internal Server Error');

    }
};

module.exports = { handleOAuthCallback };

