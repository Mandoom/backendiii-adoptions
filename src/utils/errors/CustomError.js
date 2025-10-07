// estructura que nos da un poco de trazabilidad y clara clasificacion de errores
export default class CustomError extends Error {
  constructor({ name='Error', message, cause, code }) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static create({ name, message, cause, code }) {
    return new CustomError({ name, message, cause, code });
  }
}