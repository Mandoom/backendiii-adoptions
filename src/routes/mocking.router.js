import { Router } from 'express';
import { generateFakePets } from '../mocks/pets.mocks.js';

const router = Router();

/**
 * GET /api/mocking/pets?amount=100
 * Devuelve 'amount' mascotas falsas (por defecto 100).
 */
router.get('/pets', (req, res) => {
  const amount = Number(req.query.amount || 100);
  const pets = generateFakePets(Number.isFinite(amount) && amount > 0 ? amount : 100);
  res.send({ status: 'success', payload: pets });
});

export default router;
