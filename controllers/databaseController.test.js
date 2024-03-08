// Import the functions to be tested
const { 
    saveCategoryToDatabase,
    getUserIdByMembershipId,
    saveDefaultGroupsToDatabase,
    getGroupIdByName,
    saveMetricToDatabase,
    saveMetricsToDatabase
} = require('./databaseController');
  
  // Mock the database module
  jest.mock('../db', () => ({
    query: jest.fn(),
  }));
  
describe('Database Controller', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mock call history after each test
    });
  
    describe('saveCategoryToDatabase', () => {
      it('should save a category to the database', async () => {
        // Mock db.query to resolve with the expected result
        const expectedId = 1;
        const mockQueryResult = { rows: [{ id: expectedId }] };
        require('../db').query.mockResolvedValue(mockQueryResult);
  
        // Call the function
        const result = await saveCategoryToDatabase('Test Category');
  
        // Assertions
        expect(result).toBe(expectedId);
        expect(require('../db').query).toHaveBeenCalledWith(
          'INSERT INTO categories (name) VALUES ($1) RETURNING id;', ['Test Category']
        );
      });
    });
  
    describe('getUserIdByMembershipId', () => {
      it('should return user ID for a given membership ID', async () => {
        // Mock db.query to resolve with the expected result
        const mockQueryResult = { rows: [{ id: 1 }] };
        require('../db').query.mockResolvedValue(mockQueryResult);
  
        // Call the function
        const result = await getUserIdByMembershipId('test-membership-id');
  
        // Assertions
        expect(result).toBe(1);
        expect(require('../db').query).toHaveBeenCalledWith(
          'SELECT id FROM users WHERE membership_id = $1;', ['test-membership-id']
        );
      });
  
      it('should throw an error if user with given membership ID is not found', async () => {
        // Mock db.query to resolve with no rows
        const mockQueryResult = { rows: [] };
        require('../db').query.mockResolvedValue(mockQueryResult);
  
        // Call the function and expect it to throw an error
        await expect(getUserIdByMembershipId('non-existing-membership-id')).rejects.toThrow();
        expect(require('../db').query).toHaveBeenCalledWith(
          'SELECT id FROM users WHERE membership_id = $1;', ['non-existing-membership-id']
        );
      });
    });
  
    describe('saveDefaultGroupsToDatabase', () => {
      it('should save default groups to the database if they do not exist', async () => {
        // Mock db.query to resolve with no rows, indicating that groups do not exist
        const mockQueryResult = { rows: [] };
        require('../db').query.mockResolvedValue(mockQueryResult);
  
        // Call the function
        await saveDefaultGroupsToDatabase(require('../db'));
  
        // Assertions
        expect(require('../db').query).toHaveBeenCalledTimes(1);
        expect(require('../db').query).toHaveBeenCalledWith(
          'INSERT INTO groups (name) VALUES ($1), ($2), ($3)', ['Career', 'Seasonal', 'Weekly']
        );
      });
  
      it('should not save default groups to the database if they already exist', async () => {
        // Mock db.query to resolve with existing groups
        const mockQueryResult = { rows: [{ name: 'Career' }, { name: 'Seasonal' }, { name: 'Weekly' }] };
        require('../db').query.mockResolvedValue(mockQueryResult);
  
        // Call the function
        await saveDefaultGroupsToDatabase(require('../db'));
  
        // Assertions
        expect(require('../db').query).toHaveBeenCalledTimes(1);
        expect(require('../db').query).toHaveBeenCalledWith('SELECT * FROM groups');
      });
    });

    describe('getGroupIdByName', () => {
        it('should return group ID for an existing group name', async () => {
          // Mock db.query to resolve with the expected result
          const expectedId = 1;
          const mockQueryResult = { rows: [{ id: expectedId }] };
          require('../db').query.mockResolvedValue(mockQueryResult);
    
          // Call the function
          const result = await getGroupIdByName('Test Group');
    
          // Assertions
          expect(result).toBe(expectedId);
          expect(require('../db').query).toHaveBeenCalledWith(
            'SELECT id FROM groups WHERE name = $1;', ['Test Group']
          );
        });
    
        it('should return null for a non-existing group name', async () => {
          // Mock db.query to resolve with no rows
          const mockQueryResult = { rows: [] };
          require('../db').query.mockResolvedValue(mockQueryResult);
    
          // Call the function
          const result = await getGroupIdByName('Non-existing Group');
    
          // Assertions
          expect(result).toBeNull();
          expect(require('../db').query).toHaveBeenCalledWith(
            'SELECT id FROM groups WHERE name = $1;', ['Non-existing Group']
          );
        });
      });
    
      describe('saveMetricToDatabase', () => {
        it('should save a metric to the database', async () => {
          // Mock db.query to resolve with the expected result
          const expectedMetric = { id: 1, name: 'Test Metric' };
          const mockQueryResult = { rows: [expectedMetric] };
          require('../db').query.mockResolvedValue(mockQueryResult);
    
          // Call the function
          const result = await saveMetricToDatabase(
            { name: 'Test Metric', description: 'Test Description', progress: 50 },
            1,
            1,
            1
          );
    
          // Assertions
          expect(result).toEqual(expectedMetric);
          expect(require('../db').query).toHaveBeenCalledWith(
            'INSERT INTO metrics (name, description, progress, category_id, group_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
            ['Test Metric', 'Test Description', 50, 1, 1, 1]
          );
        });
      });
});
  