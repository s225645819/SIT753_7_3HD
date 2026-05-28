const request = require('supertest');
const app = require('./server');

describe('API Health and Endpoints', () => {
    it('Should return 500 on the health endpoint to simulate an incident', async () => {
        const response = await request(app).get('/health');
        
        // Temporarily expecting the failure so the pipeline reaches Stage 7
        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe('DOWN'); 
    });
});