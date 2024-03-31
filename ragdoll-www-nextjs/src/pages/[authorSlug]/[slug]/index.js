'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Outfit } from 'next/font/google';
import { useState, useEffect } from 'react';

import { useCast } from '@/hooks';
import { Icon, Header } from '@/components';
import { slugify, getStarRating } from '@/utils';

import '@/app/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

const Cast = () => {
  const { asPath, isReady } = useRouter();

  const [authorSlug, setAuthorSlug] = useState();
  const [castSlug, setCastSlug] = useState();

  const [cast] = useCast(
    authorSlug,
    castSlug
  );

  useEffect(() => {
    if (isReady) {
      const slugs = asPath.split('/');

      setCastSlug(slugs.pop());
      setAuthorSlug(slugs.pop());
    }
  }, [asPath, isReady]);

  if (!cast) return <div />;

  const {
    name,
    author,
    rating,
    imageURL,
    unitCount,
    description
  } = cast;

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
        <Header />
        <div className="max-w-5xl w-full flex flex-col-reverse justify-between mt-4 lg:flex-col">
          <section className="max-w-5xl w-full mt-4">
            <div className="bg-slate-900 p-6 text-xl rounded-[1rem]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="truncate">
                    {name}
                  </h2>
                  <h3 className="truncate text-xs">
                    by <Link href={`/${slugify(author)}`}>{author}</Link>
                  </h3>
                </div>
                <span>
                  {getStarRating(rating)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Image
              className="rounded-full m-1 bg-slate-500 object-cover min-w-[3rem] max-w-[3rem] min-h-[3rem] max-h-[3rem]"
                  width={50}
                  height={50}
                  src={imageURL}
                  alt="avatar"
                />
                <em className="text-left font-light text-sm w-full mx-2 text-slate-500">
                  {unitCount} doll{unitCount === 1 ? '' : 's'}
                </em>
                <Link target="_blank" href={`/.casts/${slugify(author)}/${slugify(name)}/cast.json`}>
                  <Icon src="/assets/img/download.svg" size={30} />
                </Link>
              </div>
              <p className={`text-sm p-16 ${description ? '' : 'text-slate-500 italic'}`}>
                {description || 'No description.'}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
};

export default Cast;
