// test/sessions.spec.js
import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';

describe('Pruebas del router de sesiones', function () {
  // antes de inicar, abrimos conexion a db
  before(async function () {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adoptme';
    await mongoose.connect(uri);
  });

  // cerramos conexion a db despues de la spruebas
  after(async function () {
    await mongoose.connection.close();
  });

  describe('POST /api/sessions/register', function () {
    it('debería registrar un usuario y devolver su id', async function () {
      const res = await request(app)
        .post('/api/sessions/register')
        .send({
          first_name: 'Test',
          last_name: 'Register',
          email: `register${Date.now()}@example.com`,
          password: 'password123'
        });
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.payload).to.be.a('string');
    });
  });

  describe('POST /api/sessions/login', function () {
    it('debería iniciar sesión con credenciales correctas y establecer cookie', async function () {
      // registrarn usuario para tener credenciales
      const email = `login${Date.now()}@example.com`;
      await request(app)
        .post('/api/sessions/register')
        .send({
          first_name: 'Test',
          last_name: 'Login',
          email,
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email,
          password: 'password123'
        });
      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      // se envia el cookie?
      expect(res.headers['set-cookie']).to.exist;
    });

    it('debería rechazar el login con credenciales incorrectas', async function () {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email: 'inexistente@example.com',
          password: 'wrongpassword'
        });
      // podria depender dependiendo de la implementacion??
      expect(res.status).to.be.oneOf([400, 404]);
      expect(res.body.status).to.equal('error');
    });
  });
});

