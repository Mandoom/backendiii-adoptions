import winston from 'winston';

// Orden de severidad: 0 es lo más grave
const customLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

// Colores para cada nivel (solo afectan a la consola en desarrollo)
const levelColors = {
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(levelColors);

// Logger para desarrollo: muestra todos los niveles por consola
const devLogger = winston.createLogger({
  levels: customLevels,
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Logger para producción: info en consola; errores en fichero
const prodLogger = winston.createLogger({
  levels: customLevels,
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ]
});

// Exporta el logger adecuado según NODE_ENV
export const logger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
