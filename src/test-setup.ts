import 'fake-indexeddb/auto';
import '@testing-library/jest-dom';

// Mock CSS imports
const styleMock = {};

// @ts-expect-error - CSS is not defined in the global scope
global.CSS = {
  supports: () => false,
};
