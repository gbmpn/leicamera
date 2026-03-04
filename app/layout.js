'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScrollProvider } from "./providers/SmoothScrollProvider";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import "./globals.css";
// import "./grid.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {

  const router = useRouter();
  const mainRef = useRef(null);

  useEffect(() => {
    if (!document.startViewTransition) return;

    const handleClick = (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const url = link.getAttribute('href');

      // internal links only
      if (!url.startsWith('/')) return;

      e.preventDefault();

      document.documentElement.classList.add('is-route-transition');
      const transition = document.startViewTransition(() => {
        window.lenis?.scrollTo(0, { immediate: true });
        router.push(url);
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove('is-route-transition');
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
