import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClawSouls — Shared Personality",
  description: "View and customize this AI personality on ClawSouls.",
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
