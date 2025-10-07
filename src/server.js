import 'dotenv/config'; // h

import mongoose from 'mongoose';

import app from './app.js';

import { logger } from './config/logger.js';


const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adoptme';

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('[DB] Connected');

    const server = app.listen(PORT, () => {
      logger.info(`[HTTP] Listening on http://localhost:${PORT}`);
    });
    // ...
  } catch (err) {
    logger.fatal('[BOOT] Failed to start server', { error: err });
    process.exit(1);
  }
}

// PROTECCIÓN del listen:
// En test NO arrancamos servidor ni conectamos DB automáticamente
if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start }; // opcional: por si quieres arrancar desde otro script
