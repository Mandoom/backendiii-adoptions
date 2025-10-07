//si definimos una lista de errors para mappear de forma consistente

const EErrors = {
  INVALID_TYPES_ERROR: 'INVALID_TYPES_ERROR',  // datos con tipos inválidos
  VALIDATION_ERROR: 'VALIDATION_ERROR',        // payload incompleto o inválido
  AUTH_ERROR: 'AUTH_ERROR',                    // auth/roles
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',          // recurso inexistente
  DATABASE_ERROR: 'DATABASE_ERROR',            // errores de persistencia
  ROUTING_ERROR: 'ROUTING_ERROR',              // endpoint o método incorrecto
  INTERNAL_ERROR: 'INTERNAL_ERROR',            // todo lo demás
};
export default EErrors;