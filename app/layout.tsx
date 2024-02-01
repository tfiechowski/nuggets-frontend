import { GeistSans } from 'geist/font/sans';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Nuggets',
  description: 'Your best coach and companion!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
