'use client';

import { Outfit } from 'next/font/google';

import { useEffect, useState } from 'react';

import { Header, CardList } from '@/components';
import useCasts from '@/hooks/useCasts';

import '@/app/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

const Library = () => {
  const [casts] = useCasts();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(
      Array.from(casts)
        .sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : 0)
    );
  }, [casts]);

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
        <Header />
        <div className="flex flex-col-reverse justify-between lg:flex-col">
          <section className="max-w-5xl w-full mt-4">
            <CardList title={`Showing ${casts.length} of ${casts.length}`} items={recent} />
          </section>
        </div>
      </main>
    </div>
  )
};

export default Library;
