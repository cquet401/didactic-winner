/// <reference types="vite/client" />

import type { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    type IntrinsicElements = ThreeElements;
  }
}
