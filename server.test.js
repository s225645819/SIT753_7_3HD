const request = require('supertest');
const app = require('./server');

describe('API Health and Endpoints', () => {
    it('Should return 200 on the health endpoint', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('UP');
    });
});