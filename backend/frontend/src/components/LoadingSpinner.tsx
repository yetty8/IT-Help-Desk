// src/components/LoadingSpinner.tsx
import React from "react";

export default function LoadingSpinner({ size = 6 }: { size?: number }) {
  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-current border-t-transparent`} style={{ width: `${size}rem`, height: `${size}rem` }} />
  );
}
