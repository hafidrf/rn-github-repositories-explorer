module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['coverage/**', 'android/**', 'ios/**'],
  overrides: [
    {
      files: ['jest.setup.js', '**/__tests__/**', '**/*.test.*'],
      env: { jest: true },
    },
  ],
};
