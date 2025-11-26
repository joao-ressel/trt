"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";
import React from "react";
import InstallPWA from "@/components/install-pwa";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderPaths = [
    "/auth/login",
    "/auth/error",
    "/auth/forgot-password",
    "/auth/sign-up",
    "/auth/sign-up-success",
    "/auth/update-password",
    "/",
  ];
  const isAuthRoute = hideHeaderPaths.includes(pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {!isAuthRoute && (
        <>
          <header>
            <div className="flex justify-between px-6 h-20 bg-background items-center border-b">
              <div className="h-12 w-28 bg-foreground mask-[url('/name-logo.svg')] mask-cover"></div>
              <div className="flex gap-2">
                <InstallPWA />
                <ModeToggle />
                <NavUser />
              </div>
            </div>
          </header>
          <div className="-z-10 fixed opacity-10">
            <div className="h-124.5 w-100 bg-foreground mask-[url('/lines.svg')] mask-cover"></div>
          </div>
          <div className="-z-10 fixed bottom-5 right-5 opacity-10">
            <div className="h-62.5 w-100 bg-foreground mask-[url('/treasure.svg')] mask-cover"></div>
          </div>
        </>
      )}
      {children}
    </ThemeProvider>
  );
}
