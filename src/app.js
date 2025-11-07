import express from 'express';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

// import mockingRouter from './routes/mocking.router.js';
import mocksRouter from './routes/mocks.router.js';

// Error handling centralizado
import errorHandler from './middlewares/errorHandler.js';
import EErrors from './utils/errors/enum.js';
import CustomError from './utils/errors/CustomError.js';

// logger

import loggerRouter from './routes/logger.router.js';
import httpLogger from './middlewares/httpLogger.js';

// swagger

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';


const app = express();

app.use(express.json());
app.use(cookieParser());

// 
app.use(httpLogger);

//swagger

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BackendIII Adoptions API',
      version: '1.0.0',
      description: 'Documentación de la API de sesiones',
    },
  },
  // El archivo que Swagger deberá analizar para construir la documentación
  apis: [path.join(path.resolve(), 'src/routes/sessions.router.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de negocio
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

//logger tests

app.use('/', loggerRouter);

// (Opcional) Exponer mocks solo fuera de producción
// if (process.env.NODE_ENV !== 'production') {
//   app.use('/api/mocking', mockingRouter);
// }

// Exponer los mocks solo fuera de producción
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/mocks', mocksRouter);
}

// catch-all 404 -> delega al error handler
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
