const db = require('../db'); 

// Controller function to handle fetching metrics data based on membershipId
const fetchMetricsDataByMembershipId = async (req, res) => {
    try {

        
        const { membershipId } = req.query; // Fetch the membershipId from the query string

        
        // Query to fetch metrics data associated with the provided membershipId
        const query = `
            SELECT users.display_name AS display_name, categories.name AS category_name, groups.name AS group_name, metrics.name AS metric_name, metrics.description AS metric_description, metrics.progress
            FROM metrics
            JOIN users ON metrics.user_id = users.id
            JOIN groups ON metrics.group_id = groups.id
            JOIN categories ON metrics.category_id = categories.id
            WHERE users.membership_id = $1
            ORDER BY categories.id, groups.id
        `;

        
        // Execute the query with the provided membershipId
        const { rows } = await db.query(query, [membershipId]);

        // Organize the data into JSON
        const organizedData = rows.reduce((acc, row) => {
            const { category_name, group_name, metric_name, metric_description, progress } = row; 
            if (!acc[category_name]) {
                acc[category_name] = {}; // Create an array with the categories as keys
            }
            if (!acc[category_name][group_name]) {
                acc[category_name][group_name] = []; // Within each category create an arry for each group
            }
            acc[category_name][group_name].push({ name: metric_name, description: metric_description, progress }); // Create objects of metrics within each group
            return acc;
        }, {});

        const displayName = rows.length > 0 ? rows[0].display_name : null;


        

        // Send the organized metrics data as a response
        res.json({ organizedData, displayName });
    } catch (error) {
        console.error('Error fetching metrics data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    fetchMetricsDataByMembershipId,
};
