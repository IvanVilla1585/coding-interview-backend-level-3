import type { Config } from 'jest'

const config: Config = {
  testMatch: [
    '**/e2e/**/*.test.js'
  ],
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  moduleFileExtensions: ['js', 'ts']
}

export default config
