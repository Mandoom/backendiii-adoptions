// src/routes/mocks.router.js
import { Router } from 'express';
import { generateFakePets } from '../mocks/pets.mocks.js';
import { generateFakeUsers } from '../mocks/users.mocks.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

// GET /api/mocks/pets?amount=100
// Devuelve 'amount' mascotas falsas (por defecto 100).
router.get('/pets', (req, res) => {
  const amount = Number(req.query.amount || 100);
  const validAmount = Number.isFinite(amount) && amount > 0 ? amount : 100;
  const pets = generateFakePets(validAmount);
  res.send({ status: 'success', payload: pets });
});

// GET /api/mocks/mockingusers
// Genera 50 usuarios falsos con contraseñas encriptadas y roles aleatorios.
router.get('/mockingusers', async (req, res) => {
  const users = await generateFakeUsers(50);
  res.send({ status: 'success', payload: users });
});

// POST /api/mocks/generateData
// Recibe parámetros numéricos 'users' y 'pets' para generar y guardar registros.
// Los parámetros pueden enviarse por query o por body JSON.
router.post('/generateData', async (req, res) => {
  const usersAmount = Number(req.body.users || req.query.users || 0);
  const petsAmount = Number(req.body.pets || req.query.pets || 0);

  try {
    const fakeUsers = await generateFakeUsers(usersAmount);
    const fakePets = generateFakePets(petsAmount);

    await Promise.all(fakeUsers.map((user) => usersService.create(user)));
    await Promise.all(fakePets.map((pet) => petsService.create(pet)));

    res.send({
      status: 'success',
      message: `Se generaron ${usersAmount} usuarios y ${petsAmount} mascotas.`,
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: 'Error al generar datos',
      error,
    });
  }
});

export default router;
