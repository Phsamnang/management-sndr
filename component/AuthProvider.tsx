"use client";
import { SessionProvider } from "next-auth/react";
import React, { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const AuthProvider = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              // Configure default options here
              staleTime: 60 * 1000, // 1 minute
              refetchOnWindowFocus: false,
              retry: 1,
            },
          },
        })
      );  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  )

};

export default AuthProvider;
