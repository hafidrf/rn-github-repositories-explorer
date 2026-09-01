module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Transform ESM deps that ship untranspiled (RN 0.81 + Paper + Redux + Navigation)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-navigation/.*|@reduxjs/toolkit|react-redux|reselect|redux|immer|react-native-paper|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-gesture-handler|lottie-react-native)/)',
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg|json)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
