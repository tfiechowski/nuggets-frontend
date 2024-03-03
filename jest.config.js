/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '@quramy/jest-prisma/environment',
  setupFilesAfterEnv: ['<rootDir>/test/setup-prisma.ts'],
  roots: ['<rootDir>/app/', '<rootDir>/components/', '<rootDir>/lib/', '<rootDir>/utils/'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
};
