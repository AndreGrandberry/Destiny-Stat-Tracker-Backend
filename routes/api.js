// routes/metrics.js

const express = require('express');
const router = express.Router();
const { fetchMetricsDataByMembershipId } = require('../controllers/apiController');

// Endpoint to fetch metrics data from PSQL database based on membershipId
router.get('/', fetchMetricsDataByMembershipId);

module.exports = router;
