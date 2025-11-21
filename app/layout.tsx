import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className="antialiased bg-zinc-50 dark:bg-black">{children}</body>
    </html>
  );
}
