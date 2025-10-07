import EErrors from '../utils/errors/enum.js';

export default function errorHandler(err, req, res, next) {
  // Log mínimo; en prod redirígelo a un logger (p. ej., pino/winston)
  console.error('[ERROR]', {
    name: err.name,
    code: err.code,
    message: err.message,
    cause: err.cause,
  });

  switch (err.code) {
    case EErrors.VALIDATION_ERROR:
    case EErrors.INVALID_TYPES_ERROR:
      return res.status(400).send({ status: 'error', error: err.message });

    case EErrors.AUTH_ERROR:
      return res.status(401).send({ status: 'error', error: err.message });

    case EErrors.NOT_FOUND_ERROR:
      return res.status(404).send({ status: 'error', error: err.message });

    case EErrors.DATABASE_ERROR:
      return res.status(503).send({ status: 'error', error: 'Service unavailable' });

    case EErrors.ROUTING_ERROR:
      return res.status(405).send({ status: 'error', error: 'Method not allowed' });

    default:
      return res.status(500).send({ status: 'error', error: 'Internal server error' });
  }
}
