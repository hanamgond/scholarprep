// This file tells TypeScript that 'react-katex' is a valid module
declare module 'react-katex' {
  import * as React from 'react';

  export interface MathProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: any;
    as?: string | React.ComponentType<any>;
    children?: React.ReactNode;
    className?: string; // Added className prop
  }

  export const InlineMath: React.FC<MathProps>;
  export const BlockMath: React.FC<MathProps>;
}