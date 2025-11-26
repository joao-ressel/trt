import { Toaster } from "sonner";
import { LayoutWrapper } from "./_layout-wrapper";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className="antialiased bg-background text-foreground">
          <LayoutWrapper>{children}</LayoutWrapper>

          <Toaster />
        </body>
      </html>
    </>
  );
}
