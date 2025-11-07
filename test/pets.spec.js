// test/pets.spec.js
import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import path from 'path';
import app from '../src/app.js';

// for image upload....

import { fileURLToPath } from 'url';
import { dirname } from 'path';


// resolver la ruta actual del módulo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Pruebas del router de mascotas', function() {
  let petId;

  // Crear una mascota antes de los tests
  before(async function() {
     // Conexión a la base de datos
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adoptme';
    await mongoose.connect(uri);            // <- abrir conexión aquí
    
    const res = await request(app)
      .post('/api/pets')
      .send({
        name: 'Firulais',
        specie: 'Perro',
        birthDate: '2020-01-01'
      });
    petId = res.body.payload._id;
  });

   after(async function() {
    await mongoose.connection.close();      // <- cerrar conexión al terminar
  });
  it('debería devolver la lista de mascotas', async function() {
    const res = await request(app).get('/api/pets');
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an('array');
  });

  it('debería crear una mascota válida', async function() {
    const res = await request(app)
      .post('/api/pets')
      .send({
        name: 'Michi',
        specie: 'Gato',
        birthDate: '2019-05-05'
      });
    expect(res.status).to.equal(201);
    expect(res.body.payload).to.include.keys('_id', 'name', 'specie', 'birthDate');
  });

  it('debería fallar al crear una mascota si faltan campos', async function() {
    const res = await request(app)
      .post('/api/pets')
      .send({ name: 'Mascota incompleta' });
    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal('error');
  });

  it('debería actualizar una mascota existente', async function() {
    const res = await request(app)
      .put(`/api/pets/${petId}`)
      .send({ name: 'Firulais actualizado' });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('pet updated');
  });

  it('debería devolver 400 si el cuerpo de actualización está vacío', async function() {
    const res = await request(app)
      .put(`/api/pets/${petId}`)
      .send({});
    expect(res.status).to.equal(400);
  });

  it('debería devolver 400 si el id de la mascota no es válido', async function() {
    const res = await request(app)
      .put('/api/pets/123')
      .send({ name: 'Mascota' });
    expect(res.status).to.equal(400);
  });

  it('debería devolver 404 al actualizar una mascota inexistente', async function() {
    const randomId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/pets/${randomId}`)
      .send({ name: 'No existe' });
    expect(res.status).to.equal(404);
  });

  it('debería eliminar una mascota existente', async function() {
    const res = await request(app).delete(`/api/pets/${petId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('pet deleted');
  });

  it('debería devolver 400 al eliminar con id inválido', async function() {
    const res = await request(app).delete('/api/pets/123');
    expect(res.status).to.equal(400);
  });

  it('debería devolver 404 al eliminar una mascota inexistente', async function() {
    const randomId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/pets/${randomId}`);
    expect(res.status).to.equal(404);
  });

  it('debería crear una mascota con imagen', async function() {
    // Asegúrate de tener una imagen llamada dog.jpg en test/fixtures
    const res = await request(app)
      .post('/api/pets/withimage')
      .field('name', 'Kira')
      .field('specie', 'Perro')
      .field('birthDate', '2018-09-01')
      .attach('image', path.join(__dirname, 'fixtures', 'dog.jpg'));
    expect(res.status).to.equal(201);
    expect(res.body.payload).to.have.property('_id');
  });
});
