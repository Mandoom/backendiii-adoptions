// src/mocks/users.mocks.js
import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';


export async function generateFakeUser(overrides = {}) {
  const passwordHash = await createHash('coder123');

  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: passwordHash,
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: [],
    ...overrides,
  };
}


export async function generateFakeUsers(amount = 50) {
  const users = [];
  for (let i = 0; i < amount; i++) {
    users.push(await generateFakeUser());
  }
  return users;
}
