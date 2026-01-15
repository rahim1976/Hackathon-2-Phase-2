import { ReactNode } from 'react';
import Navbar from '../components/navigation/Navbar';
import './globals.css';
import { AppProviders } from './providers';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950" suppressHydrationWarning={true}>
        <AppProviders>
          <Navbar />
          <div className="container mx-auto py-6">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}