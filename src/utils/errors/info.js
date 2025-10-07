//esto limitaria en production los detalles del  error que se envian al client pero manetiendo una trazabilidad detallada de las causas del error

export const generatePetValidationCause = (payload) => {
  const required = ['name', 'specie', 'birthDate'];
  const missing = required.filter(k => !(k in payload));
  return `Campos faltantes: ${missing.join(', ') || 'ninguno'}; Payload: ${JSON.stringify(payload)}`;
};
