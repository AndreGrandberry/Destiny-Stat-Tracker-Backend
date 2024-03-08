// Import the function to be tested
const { fetchMetricsDataByMembershipId } = require('./apiController'); 
// Mock the request and response objects
const req = { query: { membershipId: 'testMembershipId' } };
const res = { json: jest.fn(), status: jest.fn() };

// Mock the database module
jest.mock('../db', () => ({
  query: jest.fn().mockResolvedValue({ rows: [{ display_name: 'Test User', category_name: 'Category', group_name: 'Group', metric_name: 'Metric', metric_description: 'Description', progress: 50 }] }),
}));

describe('fetchMetricsDataByMembershipId', () => {
  it('should fetch metrics data based on membershipId', async () => {
    // Call the controller function
    await fetchMetricsDataByMembershipId(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({ organizedData: { Category: { Group: [{ name: 'Metric', description: 'Description', progress: 50 }] } }, displayName: 'Test User' });
  });

  it('should handle errors when fetching metrics data', async () => {
    // Mock the database query to throw an error
    const error = new Error('Database error');
    const db = require('../db'); // Import inside test to use the mocked version
    db.query.mockRejectedValue(error);

    // Call the controller function
    await fetchMetricsDataByMembershipId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
