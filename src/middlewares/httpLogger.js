import { logger } from '../config/logger.js';

const httpLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
};

export default httpLogger;
