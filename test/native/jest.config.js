
module.exports = {
    testEnvironment: "node",
    rootDir: '../../',
    testMatch: [
        '<rootDir>/lib/*.spec.ts',
        '<rootDir>/lib/echo_rpc/*.spec.ts'
    ],
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json'
        }
    },
    transform: {
        "binding.js$": ['ts-jest'],
        "^.+\\.ts?$": ['ts-jest'],
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/samples/'
    ],
    modulePathIgnorePatterns: [
        '/cmake-js/'
    ],
    setupFiles: ['<rootDir>/test/native/jest.setup.ts']
}
