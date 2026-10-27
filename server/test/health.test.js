import app from '../app.js';
import request from 'supertest';

describe('GET api/health', () => {
    it('response with status 200 and { status: "ok"}', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok"});
    });
});