import 'dotenv/config'; // h

import mongoose from 'mongoose';

import app from './app.js';

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adoptme';

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[DB] Connected');

    const server = app.listen(PORT, () => {
      console.log(`[HTTP] Listening on http://localhost:${PORT}`);
    });

    // Apagado elegante
    const shutdown = async (signal) => {
      console.log(`[SYS] ${signal} received, shutting down...`);
      await mongoose.connection.close();
      server.close(() => process.exit(0));
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('[BOOT] Failed to start server', err);
    process.exit(1);
  }
}

// PROTECCIÓN del listen:
// En test NO arrancamos servidor ni conectamos DB automáticamente
if (process.env.NODE_ENV !== 'test') {
  start();
}

export { start }; // opcional: por si quieres arrancar desde otro script
