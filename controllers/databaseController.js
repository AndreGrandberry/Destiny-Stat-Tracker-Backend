const db = require('../db');

async function saveCategoryToDatabase(categoryName) { // SQL QUERY to insert a category name and return its ID
    try {
        const query = `
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING id; -- Return only the ID
        `;
        const values = [categoryName];
        const result = await db.query(query, values);
        return result.rows[0].id; // Return only the ID
    } catch (error) {
        console.error('Error saving category to database:', error);
        throw error;
    }
}

async function getUserIdByMembershipId(membershipId) { // SQL query to return a user ID by passing in a membershipID
    try {
        const query = `
            SELECT id FROM users WHERE membership_id = $1;
        `;
        const values = [membershipId];
        const result = await db.query(query, values);
        if (result.rows.length > 0) {
            return result.rows[0].id;
        } else {
            throw new Error(`User with membership ID ${membershipId} not found.`);
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
    }
}

const saveDefaultGroupsToDatabase = async (db) => {
    try {
        // Check if the groups already exist in the database
        const existingGroups = await db.query('SELECT * FROM groups');

        if (existingGroups.rows.length === 0) {
            // If no groups exist, insert the default groups
            await db.query('INSERT INTO groups (name) VALUES ($1), ($2), ($3)', ['Career', 'Seasonal', 'Weekly']);
            console.log('Default groups inserted into the database.');
        } else {
            console.log('Groups already exist in the database.');
        }
    } catch (error) {
        console.error('Error saving default groups to the database:', error);
        throw error;
    }
};


async function getGroupIdByName(groupName) {
    try {
        console.log(`Fetching groupId for group '${groupName}'`); //SQL query to locate and return a groupID by passing in the name
        const query = `
            SELECT id FROM groups WHERE name = $1;
        `;
        const values = [groupName];
        const result = await db.query(query, values);
        console.log(`Result from database:`, result.rows);
        if (result.rows.length === 0) {
            console.error(`Group '${groupName}' not found in the database.`);
            return null; // Return null if group not found
        }
        return result.rows[0].id;
    } catch (error) {
        console.error(`Error fetching groupId for group '${groupName}':`, error);
        throw error;
    }
}


async function saveMetricToDatabase(metricData, categoryId, groupId, userId) {
    try {
        const { name, description, progress } = metricData; // SQL query to insert a new metric and return its data
        const query = `
            INSERT INTO metrics (name, description, progress, category_id, group_id, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [name, description, progress, categoryId, groupId, userId];
        const result = await db.query(query, values);
        return result.rows[0]; // Assuming you want to return the inserted metric
    } catch (error) {
        console.error('Error saving metric to database:', error);
        throw error;
    }
}


async function saveMetricsToDatabase(metricsData, membershipId) {
    try {

        const userId = await getUserIdByMembershipId(membershipId);
        // Iterate through each category in the metrics data
        for (const category of Object.keys(metricsData)) {
            console.log(`Processing category: ${category}`);
            // Save the category to the database and get its ID
            let categoryId = await saveCategoryToDatabase(category);
            console.log(`Category '${category}' inserted with ID: ${categoryId}`);

            // Iterate through each metric in the category
            for (const metric of metricsData[category]) {
                // Save the metric to the database, passing the category ID
                console.log(`Saving metric '${metric.name}'...`);
                const groupId = await getGroupIdByName(metric.groupName);
                console.log(`Group ID for '${metric.groupName}': ${groupId}`);
                await saveMetricToDatabase(metric, categoryId, groupId, userId);
                console.log(`Metric '${metric.name}' saved successfully.`);
            }
        }

       
    } catch (error) {
        console.error('Error saving metrics data to database:', error);
        throw error;
    }
}

module.exports = { saveDefaultGroupsToDatabase, saveMetricsToDatabase, saveMetricToDatabase, getGroupIdByName, getUserIdByMembershipId, saveCategoryToDatabase };
