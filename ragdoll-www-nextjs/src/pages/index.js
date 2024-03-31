'use client';

import Image from 'next/image';
import { Outfit } from 'next/font/google';
import { useEffect, useState } from 'react';

import useCasts from '@/hooks/useCasts';
import { Icon, Header, CardList } from '@/components';

import '@/app/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

const Home = () => {
  const [casts] = useCasts();

  const [latest, setLatest] = useState([]);
  const [top, setTop] = useState([]);

  useEffect(() => {
    setLatest(
      Array.from(casts)
        .sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : 0)
        .slice(0, 8)
    );

    setTop(
      Array.from(casts)
        .sort((a, b) => a.rating < b.rating ? 1 : 0)
        .slice(0, 8)
    );
  }, [casts]);

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
        <Header />
        <div className="flex flex-col-reverse justify-between lg:flex-col">
          <section className="max-w-5xl w-full mt-4">
            {top.length === 0
              ? <em className="text-slate-500">No data for "top casts".</em>
              : <CardList title="Top" items={top} />}
          </section>
          <section className="max-w-5xl w-full mt-4 mb-8">
            {latest.length === 0
              ? <em className="text-slate-500">No data for "latest casts".</em>
              : <CardList title="Latest" items={latest} />}
          </section>
          <section className="max-w-5xl w-full mt-4 pt-4 lg:border-t lg:border-slate-800">
            <h3 className="text-center text-5xl font-black my-4">Domain-Specific Personas</h3>
            <h4 className="text-center text-lg my-1">Create, interact with, and deploy AI personas with scoped knowledge and distinct personalities.</h4>
            <h4 className="text-center text-lg my-1 mb-4">Run models on your own machine. No accounts or API keys required.</h4>
            <Image
              src="/assets/img/product.png"
              alt="Ragdoll Studio"
              width={1268}
              height={776}
              style={{
                width: '100%',
                height: '100%'
              }}
              className="max-w-5xl mt-10"
            />
            <div className="flex justify-center py-8">
              <a target="_blank" href="https://github.com/bennyschmidt/ragdoll-studio" className="flex items-center justify-center gap-2 w-full mt-8 px-5 py-3 bg-white text-slate-500 text-center rounded-full lg:max-w-[14rem] lg:mt-0">
                <Icon src="/assets/img/github.svg" />
                <span className="w-auto lg:w-full">Download Source</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
};

export default Home;
