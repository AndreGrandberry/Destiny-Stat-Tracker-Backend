const axios = require('axios');
const { organizeMetricsByGroups, fetchMetricDefinition, fetchPresentationNodeMetrics, getGroupName, fetchMetricsProgress, fetchMetrics } = require('./metricsController');
const { BUNGIE_API_KEY } = require('../config');

jest.mock('axios');

describe('metricsController', () => {
    describe('organizeMetricsByGroups', () => {
        it('should organize metrics by groups', async () => {
            // Mock fetchPresentationNodeMetrics to return sample data
            const presentationNodes = [
                { presentationNodeHash: 123, categoryName: 'Category1' },
                { presentationNodeHash: 456, categoryName: 'Category2' }
            ];
            const accessToken = 'test-access-token';
            const membershipType = 'test-membership-type';
            const membershipId = 'test-membership-id';

            axios.get.mockResolvedValueOnce({ data: { Response: [] } }); // Mock empty response for fetchPresentationNodeMetrics
            axios.get.mockResolvedValueOnce({ data: { Response: { displayProperties: { name: 'Test Metric' } } } }); // Mock response for fetchMetricDefinition
            axios.get.mockResolvedValueOnce({ data: { Response: { metrics: { data: { metrics: {} } } } } }); // Mock response for fetchMetricsProgress

            const result = await organizeMetricsByGroups(presentationNodes, accessToken, membershipType, membershipId);

            expect(result).toEqual({
                Category1: [{ name: 'Test Metric', description: undefined, progress: undefined, groupName: 'Other' }],
                Category2: [{ name: 'Test Metric', description: undefined, progress: undefined, groupName: 'Other' }]
            });
            expect(axios.get).toHaveBeenCalledTimes(3); // Ensure axios.get called 3 times
        });
    });

    describe('fetchMetricDefinition', () => {
        it('should fetch metric definition', async () => {
            const metricHash = 'test-metric-hash';
            const accessToken = 'test-access-token';
            
            axios.get.mockResolvedValueOnce({ data: { Response: { displayProperties: { name: 'Test Metric' } } } });

            const result = await fetchMetricDefinition(metricHash, accessToken);

            expect(result).toEqual({ displayProperties: { name: 'Test Metric' } });
            expect(axios.get).toHaveBeenCalledWith(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyMetricDefinition/${metricHash}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-API-KEY': BUNGIE_API_KEY,
                }
            });
        });
    });

    describe('fetchPresentationNodeMetrics', () => {
        it('should fetch presentation node metrics', async () => {
            const presentationNodeHash = 'test-presentation-node-hash';
            const accessToken = 'test-access-token';

            axios.get.mockResolvedValueOnce({ data: { Response: { children: { metrics: [] } } } });

            const result = await fetchPresentationNodeMetrics(presentationNodeHash, accessToken);

            expect(result).toEqual([]);
            expect(axios.get).toHaveBeenCalledWith(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyPresentationNodeDefinition/${presentationNodeHash}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-API-KEY': BUNGIE_API_KEY,
                }
            });
        });
    });

    describe('fetchMetricsProgress', () => {
        it('should fetch metrics progress', async () => {
            const metricHash = 'test-metric-hash';
            const membershipType = 'test-membership-type';
            const membershipId = 'test-membership-id';
            const accessToken = 'test-access-token';

            axios.get.mockResolvedValueOnce({ data: { Response: { metrics: { data: { metrics: { [metricHash]: { objectiveProgress: { progress: 50 } } } } } } } });

            const result = await fetchMetricsProgress(metricHash, membershipType, membershipId, accessToken);

            expect(result).toEqual(50);
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`Destiny2/${membershipType}/Profile/${membershipId}`), expect.any(Object));
        });
    });

    describe('getGroupName', () => {
        it('should return group name', () => {
            const metricData = { traitHashes: [4263853822] };

            const result = getGroupName(metricData);

            expect(result).toEqual('Career');
        });

        it('should return "Other" for invalid input', () => {
            const metricData = null;

            const result = getGroupName(metricData);

            expect(result).toEqual('Other');
        });
    });

    describe('fetchMetrics', () => {
        it('should fetch metrics data', async () => {
            const membershipType = 'test-membership-type';
            const membershipId = 'test-membership-id';
            const accessToken = 'test-access-token';

            axios.get.mockResolvedValueOnce({ data: { Response: {} } });

            const result = await fetchMetrics(membershipType, membershipId, accessToken);

            expect(result).toEqual({});
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`Destiny2/${membershipType}/Profile/${membershipId}`), expect.any(Object));
        });
    });
});
