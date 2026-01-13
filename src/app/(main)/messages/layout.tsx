// app/(main)/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';  // adjust path
import { Providers } from '../../providers';  // adjust path to app/providers.tsx

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Facebook Pro - Connect with friends and the world',
  description: 'A modern social media platform built with Next.js, TypeScript, and MongoDB',
  keywords: ['social media', 'facebook', 'social network', 'friends', 'posts'],
};

export default function MainRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Optional: add shared dashboard UI like Navbar/Sidebar here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
