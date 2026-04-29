"use client";

import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className, delay }: FadeUpProps) {
  return (
    <div
      className={`animate-fade-up ${className || ""}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>;
}

export function FloatingElement({ children, className, delay }: FadeUpProps) {
  return (
    <div
      className={className}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
