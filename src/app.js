import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

import errorHandler from './middlewares/errorHandler.js';

import mockingRouter from './routes/mocking.router.js';

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect('mongodb://127.0.0.1:27017/adoptme')

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use('/api/mocking', mockingRouter);

// "catch - all para rutas no definidas"

app.use((req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  err.code = 'ROUTING_ERROR';
  next(err);
});


//error handler siempre al final del pipeline 
app.use(errorHandler);


app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
