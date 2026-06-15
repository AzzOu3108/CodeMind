import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner'
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "CodeMind",
  description: "AI learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Toaster richColors position='top-center' />
      </body>
    </html>
  );
}
