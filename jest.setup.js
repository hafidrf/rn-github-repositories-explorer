// Jest setup — mock native modules that require native bridge
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    GestureHandlerRootView: ({ children, style }: any) => React.createElement(React.Fragment, null, children),
    gestureHandlerRootHOC: (c: any) => c,
  };
});

// react-native-safe-area-context: provide a version that works in jest (no native)
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  // Create contexts that Paper's SafeAreaProviderCompat consumes
  // It reads SafeAreaInsetsContext.Consumer and expects object or null
  const InsetCtx = React.createContext({ top: 0, bottom: 0, left: 0, right: 0 });
  const FrameCtx = React.createContext(null);
  return {
    // Provide a provider that just renders children, but also exports the contexts
    // so SafeAreaProviderCompat.Consumer reads the same object (not undefined)
    SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    SafeAreaInsetsContext: InsetCtx,
    SafeAreaFrameContext: FrameCtx,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    initialWindowMetrics: null,
    // For compat that does Dimensions.get('window')
    // leave Dimensions real
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const Mock = (props) => React.createElement('View', props);
  Mock.displayName = 'LottieView';
  return { __esModule: true, default: Mock };
});
