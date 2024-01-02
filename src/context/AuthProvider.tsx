"use client";

import { SessionProvider } from "next-auth/react";
import Providers from "src/components/layout/providers";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SessionProvider>{children}</SessionProvider>
    </Providers>
  );
}
