import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

import UserModel from '../src/dao/models/User.js';
import PetModel from '../src/dao/models/Pet.js';
import AdoptionModel from '../src/dao/models/Adoption.js';

describe('Functional: adoption.router.js', function () {
  this.timeout(20000);

  let mongo, userId, petId, adoptionId;
  const base = '/api/adoptions';

  before(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

    const user = await UserModel.create({ first_name: 'Ada', last_name: 'Lovelace', email: 'ada@example.com', password: 'hashed' });
    userId = user._id.toString();
    const pet = await PetModel.create({ name: 'Cesar', specie: 'dog', birthDate: new Date('2018-03-01'), adopted: false });
    petId = pet._id.toString();

    const otherUser = await UserModel.create({ first_name: 'Grace', last_name: 'Hopper', email: 'grace@example.com', password: 'hashed' });
    const otherPet = await PetModel.create({ name: 'Mishi', specie: 'cat', birthDate: new Date('2020-01-01'), adopted: true, owner: otherUser._id });
    const adoption = await AdoptionModel.create({ owner: otherUser._id, pet: otherPet._id });
    adoptionId = adoption._id.toString();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  it('GET /api/adoptions devuelve todas las adopciones', async () => {
    const res = await request(app).get(base).expect(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body.payload).to.be.an('array').with.length.greaterThan(0);
  });

  it('GET /api/adoptions/:aid obtiene una adopción existente', async () => {
    const res = await request(app).get(`${base}/${adoptionId}`).expect(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body.payload).to.have.property('_id', adoptionId);
  });

  it('GET /api/adoptions/:aid devuelve 404 si no existe', async () => {
    const fake = new mongoose.Types.ObjectId().toString();
    await request(app).get(`${base}/${fake}`).expect(404);
  });

  it('POST /api/adoptions/:uid/:pid crea una adopción', async () => {
    const res = await request(app).post(`${base}/${userId}/${petId}`).expect(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('message', 'Pet adopted');

    const pet = await PetModel.findById(petId);
    expect(pet.adopted).to.equal(true);
    expect(pet.owner.toString()).to.equal(userId);

    const user = await UserModel.findById(userId);
    expect(user.pets.some(p => p._id.toString() === petId)).to.equal(true);
  });

  it('POST falla si el usuario no existe', async () => {
    const fakeUser = new mongoose.Types.ObjectId().toString();
    await request(app).post(`${base}/${fakeUser}/${petId}`).expect(404);
  });

  it('POST falla si la mascota no existe', async () => {
    const fakePet = new mongoose.Types.ObjectId().toString();
    await request(app).post(`${base}/${userId}/${fakePet}`).expect(404);
  });

  it('POST falla si la mascota ya está adoptada', async () => {
    const u = await UserModel.create({ first_name: 'Linus', last_name: 'Torvalds', email: 'linus@example.com', password: 'hashed' });
    const adoptedPet = await PetModel.create({ name: 'Doggo', specie: 'dog', adopted: true, owner: u._id });
    await request(app).post(`${base}/${userId}/${adoptedPet._id.toString()}`).expect(400);
  });

  it('POST maneja IDs no válidos (404/400)', async () => {
    await request(app).post(`${base}/invalidId/${petId}`).expect(404);
  });
});
