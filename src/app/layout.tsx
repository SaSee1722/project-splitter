import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Project Splitter AI — Turn Hackathon Ideas Into Team-Ready Plans',
  description:
    'Convert problem statements into complete development blueprints with screen assignments, file ownership, AI coding prompts, and team work distribution powered by Google Gemini.',
  keywords: 'hackathon, project planning, AI, team collaboration, development blueprint',
  openGraph: {
    title: 'Project Splitter AI',
    description: 'Turn a hackathon problem statement into a complete, team-ready development plan.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <ToastProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
