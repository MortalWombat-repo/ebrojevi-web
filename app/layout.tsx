import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ebrojevi API',
  description: 'API za pristup bazi Ebrojeva',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1a2332] to-[#141c28]">
          <Navbar />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
