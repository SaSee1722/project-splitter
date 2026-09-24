import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'TeamForge AI — Turn Ideas Into Team-Ready Projects',
  description:
    'Convert software problem statements into structured project plans, screen architectures, and balanced team workloads using Google Gemini API.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <ToastProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
