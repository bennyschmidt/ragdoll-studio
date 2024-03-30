'use client';

import Image from 'next/image';
import { Outfit } from 'next/font/google';
import { useEffect, useState } from 'react';

import useCasts from '@/hooks/useCasts';
import { Icon, Header, CardList } from '@/components';

import '@/app/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

const Developers = () => {

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
        <Header />
        <div className="flex flex-col-reverse justify-between lg:flex-col">
          <section className="max-w-5xl w-full mt-4">
            Coming soon.
          </section>
        </div>
      </main>
    </div>
  )
};

export default Developers;
