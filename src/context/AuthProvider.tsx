"use client";

import { SessionProvider } from "next-auth/react";
import Providers from "src/components/layout/providers";
import SocketProvider from "src/hooks/useSocketConnection";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <SocketProvider>
        <Providers>{children}</Providers>
      </SocketProvider>
    </SessionProvider>
  );
}
