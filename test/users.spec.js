// test/users.spec.js
import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';

//





describe('Pruebas del router de usuarios', function() {
  let userId;

  // Crear un usuario de prueba antes de ejecutar los tests
  before(async function() {

       // Conexión a la base de datos
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adoptme';
    await mongoose.connect(uri);  
    // Crear un usuario de prueba          // <- abrir conexión aquí
    const res = await request(app)
      .post('/api/sessions/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: `user${Date.now()}@example.com`,
        password: 'password123'
      });
    userId = res.body.payload; // Guardamos el _id del usuario creado
  });

   after(async function() {
    await mongoose.connection.close();      // <- cerrar conexión al terminar
  });


  it('debería devolver la lista de usuarios', async function() {
    const res = await request(app).get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('payload').that.is.an('array');
  });

  it('debería devolver un usuario por su id', async function() {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property('_id', userId);
  });

  it('debería devolver 404 si el usuario no existe', async function() {
    const res = await request(app).get(`/api/users/${new mongoose.Types.ObjectId()}`);
    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal('error');
  });

  it('debería actualizar un usuario existente', async function() {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ first_name: 'Actualizado' });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User updated');
  });

  it('debería eliminar un usuario', async function() {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User deleted');
  });
});
