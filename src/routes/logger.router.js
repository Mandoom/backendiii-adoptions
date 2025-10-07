import { Router } from 'express';
import { logger } from '../config/logger.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
  logger.debug('Prueba de nivel DEBUG');
  logger.http('Prueba de nivel HTTP');
  logger.info('Prueba de nivel INFO');
  logger.warning('Prueba de nivel WARNING');
  logger.error('Prueba de nivel ERROR');
  logger.fatal('Prueba de nivel FATAL');
  res.send({ status: 'success', message: 'Logs generados' });
});

export default router;
