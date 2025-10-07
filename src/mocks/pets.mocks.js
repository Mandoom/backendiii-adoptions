import { faker } from '@faker-js/faker';

export function generateFakePet(overrides = {}) {
  return {
    name: faker.person.firstName(),            // o faker.animal.petName()
    specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'rabbit', 'reptile']),
    birthDate: faker.date.past({ years: 12 }), // fecha en el pasado
    adopted: faker.datatype.boolean({ probability: 0.3 }),
    image: faker.image.urlPicsumPhotos(),      // simula ruta/URL de imagen
    ...overrides,
  };
}

export function generateFakePets(amount = 100) {
  return Array.from({ length: amount }, () => generateFakePet());
}
