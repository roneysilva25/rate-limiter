module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  }
}