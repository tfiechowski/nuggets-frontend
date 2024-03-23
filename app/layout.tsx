import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Providers } from '@/app/providers';
import Head from 'next/head';

import { Bitter } from 'next/font/google';

const bitter = Bitter({ subsets: ['latin'], variable: '--font-bitter' });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://127.0.0.1:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Nuggets - boos your win rate with Nuggets',
  description: 'Nuggets is your Sales Assistant',
  cardImage: '/og.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <Head>
        <title>Nuggets - boost your win rate with Nuggets</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:url" content={`https://getnuggets.io`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:image" content={metadata.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@vercel" /> */}
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.cardImage} />

        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"
          rel="stylesheet"
        ></link>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dosis&family=Josefin+Sans&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <body className="bg-background text-foreground">
        <main className={`min-h-screen flex flex-col items-center ${bitter.variable}`}>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
