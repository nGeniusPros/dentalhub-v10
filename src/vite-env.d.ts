/// <reference types="vite/client" />

declare module 'react/jsx-runtime' {
  import * as React from 'react';
  export { jsx, jsxs, Fragment } from 'react';
}
