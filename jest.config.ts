const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest/utils')

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>//coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageProvider: 'babel',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>'
  }),
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.spec.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ]
}
