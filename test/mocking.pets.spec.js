import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('GET /api/mocking/pets', () => {
  it('devuelve 100 mascotas falsas por defecto', async () => {
    const res = await request(app).get('/api/mocks/pets');
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('success');
    expect(Array.isArray(res.body.payload)).to.equal(true);
    expect(res.body.payload.length).to.equal(100);
    expect(res.body.payload[0]).to.have.property('name');
    expect(res.body.payload[0]).to.have.property('specie');
  });

  it('permite configurar la cantidad con ?amount=5', async () => {
    const res = await request(app).get('/api/mocks/pets?amount=5');
    expect(res.status).to.equal(200);
    expect(res.body.payload.length).to.equal(5);
  });
});
