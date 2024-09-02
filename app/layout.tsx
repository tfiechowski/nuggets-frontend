import { GeistSans } from 'geist/font/sans';
import Head from 'next/head';
import './globals.css';

import { NEXT_PUBLIC_DEFAULT_URL } from '@/app/utils/config';
import { Bitter } from 'next/font/google';

const bitter = Bitter({ subsets: ['latin'], variable: '--font-bitter' });

export const metadata = {
  metadataBase: new URL(NEXT_PUBLIC_DEFAULT_URL),
  title: 'Nuggets - boost your win rate with Nuggets',
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

        <meta name="google-site-verification" content="9dxn9vhSet4Sqe8MM1uNyx26Bfb6Gi5tMznq7UuMRcA" />

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
          {children}
        </main>
      </body>
    </html>
  );
}
