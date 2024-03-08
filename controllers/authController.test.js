// Import the function to be tested
const { handleOAuthCallback } = require('./authController');

// Mock required modules
jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { access_token: 'test_access_token' } }),
  get: jest.fn().mockResolvedValue({ data: { Response: { destinyMemberships: [{ membershipId: 'test_membership_id', crossSaveOverride: 'test_membership_type' }], bungieNetUser: { uniqueName: 'test_display_name' } } } }),
}));

// Mock request and response objects
const req = { query: { code: 'test_code' }, session: {}, session: {} };
const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };

describe('handleOAuthCallback', () => {
  it('should handle OAuth callback and save user data', async () => {
    // Call the controller function
    await handleOAuthCallback(req, res);

    // Assertions
    expect(req.session.accessToken).toBe('test_access_token');
    expect(req.session.membershipType).toBe('test_membership_type');
    expect(req.session.membershipId).toBe('test_membership_id');
    expect(res.redirect).toHaveBeenCalledWith('https://surely-gentle-tiger.ngrok.io/metrics');
  });

  it('should handle errors during OAuth callback', async () => {
    // Mock axios post to throw an error
    const axios = require('axios'); // Import inside test to use the mocked version
    axios.post.mockRejectedValue(new Error('Test error'));

    // Call the controller function
    await handleOAuthCallback(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});
