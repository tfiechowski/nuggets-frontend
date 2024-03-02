/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app/', '<rootDir>/components/', '<rootDir>/lib/', '<rootDir>/utils/'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
};
