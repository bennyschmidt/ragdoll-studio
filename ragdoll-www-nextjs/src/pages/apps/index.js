'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Outfit } from 'next/font/google';
import { useState } from 'react';

import { Header } from '@/components';

import '@/app/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

const IMAGE_SIZE = 512;
const NO_DATA = "There are no available apps.";

const Apps = () => {
  const [apps] = useState([]);

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
        <Header />
        <section className="max-w-3xl w-full mt-4">
          <h3 className="my-4">Ragdoll Apps</h3>
          <p className="opacity-40 mb-4">Apps that ship with Ragdoll including hard forks and derivations of the Ragdoll Studio software may be listed here. For content created using Ragdoll, visit the <Link className="underline" href="/feed">Feed</Link>.</p>
          {!apps?.length && <h3 className="text-center m-4 p-0 opacity-40">{NO_DATA}</h3>}
          <ul className="grid grid-cols-2 gap-4 w-full mt-8">
            {apps.map(({
              title,
              href,
              src,
              author,
              date,
              categories
            }) => (
              <li key={href} className="flex-1 rounded-lg border border-solid border-slate-900 m-0 p-4">
                <h3 className="text-lg my-2">{title}</h3>
                <Link
                  href={href}
                  target="_blank"
                  className="relative block w-100 h-100"
                >
                  <Image
                    src={src}
                    alt="itch.io"
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </Link>
                <div className="flex justify-between items-center my-2 opacity-40 text-sm">
                  <p>{author}</p>
                  <p>{date}</p>
                </div>
                <div className="flex justify-between items-center my-2 text-xs">
                  <p className="flex justify-between items-center gap-2">{categories.map(element => (
                    <span key={element} className="bg-slate-600 text-[white] px-3 py-1 rounded-full">{element.trim()}</span>)
                  )}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
};

export default Apps;
