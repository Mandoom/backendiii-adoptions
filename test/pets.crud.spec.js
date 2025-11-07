import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('CRUD /api/pets (con DB)', () => {
  before(async () => {
    process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/adoptme_test';
    await mongoose.connect(process.env.MONGODB_URI);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('crea una mascota', async () => {
    const pet = { name: 'Luna', specie: 'dog', birthDate: '2018-06-01' };
    const res = await request(app).post('/api/pets').send(pet);
    expect(res.status).to.equal(201);
    expect(res.body.payload).to.have.property('_id');
  });
});
