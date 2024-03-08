//metrics.js
const express = require('express');
const router = express.Router(); // Create a new router instance
const db = require('../db');
const { organizeMetricsByGroups } = require('../controllers/metricsController');
const { saveMetricsToDatabase, saveDefaultGroupsToDatabase } = require('../controllers/databaseController');

// const { tokenRefreshMiddleware } = require('../token/tokenRefresh');

// const { BUNGIE_API_KEY } = require('../config');

// Define the metrics route handler
router.get('/',  async (req, res) => {
    try {

        // Retrieve session data that is required for making API calls to BUNGIE
        const accessToken = req.session.accessToken; 
        const membershipType = req.session.membershipType;
        const membershipId  = req.session.membershipId;
        if (!accessToken || !membershipType || !membershipId) {
            throw new Error('User not authenticated');
        }

        await saveDefaultGroupsToDatabase(db);

        
        const presentationNodes = [ // An array of all the category for easy organization
            { presentationNodeHash: '3844527950', categoryName: "Seasons" },
            { presentationNodeHash: '2875839731', categoryName: "Account" },
            { presentationNodeHash: '565440981', categoryName: "Crucible" },
            { presentationNodeHash: '3707324621', categoryName: "Destination" },
            { presentationNodeHash: '4193411410', categoryName: "Gambit" },
            { presentationNodeHash: '926976517', categoryName: "Raids" },
            { presentationNodeHash: '2755216039', categoryName:"Strikes" },
            { presentationNodeHash: '3722177789', categoryName:"Trials of Osiris" }
        ]

        // Call the function to organize metric data
        const metricsData = await organizeMetricsByGroups(presentationNodes, accessToken, membershipType, membershipId);
        // console.log('Metrics data:', metricsData);


        // Save metrics data to the database
        await saveMetricsToDatabase(metricsData, membershipId);
        // Return the organized metrics as JSON

        res.redirect(`https://b46364ca2452.ngrok.app/dashboard?membershipId=${membershipId}`);

    } catch (error) {
        console.error('Error organizing metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

