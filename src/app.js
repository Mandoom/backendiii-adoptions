import express from 'express';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

// (si ya lo creaste) Mocking para pruebas/demos
import mockingRouter from './routes/mocking.router.js';

// Error handling centralizado
import errorHandler from './middlewares/errorHandler.js';
import EErrors from './utils/errors/enum.js';
import CustomError from './utils/errors/CustomError.js';

// logger

import loggerRouter from './routes/logger.router.js';
import httpLogger from './middlewares/httpLogger.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// 
app.use(httpLogger);

// Rutas de negocio
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

//logger tests

app.use('/', loggerRouter);

// (Opcional) Exponer mocks solo fuera de producción
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/mocking', mockingRouter);
}

// Catch-all 404 -> delega al error handler
app.use((req, res, next) => {
  next(
    CustomError.create({
      name: 'NotFoundError',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: EErrors.NOT_FOUND_ERROR
    })
  );
});

// Middleware global de errores (siempre al final del pipeline)
app.use(errorHandler);

export default app;
