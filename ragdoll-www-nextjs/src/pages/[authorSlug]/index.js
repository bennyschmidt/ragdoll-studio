'use client';

import { useRouter } from 'next/router';
import { Outfit } from 'next/font/google';
import { useEffect, useState } from 'react';

import { Header, CardList } from '@/components';
import useCasts from '@/hooks/useCasts';
import { slugify } from '@/utils';

import '@/app/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

const Profile = () => {
  const { asPath, isReady } = useRouter();
  const [casts] = useCasts();

  const [authorSlug, setAuthorSlug] = useState();
  const [authored, setAuthored] = useState([]);

  useEffect(() => {
    if (isReady) {
      const slugs = asPath.split('/');

      setAuthorSlug(slugs.pop());
    }
  }, [asPath, isReady]);

  useEffect(() => {
    if (!casts) return;

    setAuthored(
      Array.from(casts)
        .filter(({ author }) => slugify(author) === authorSlug)
    );
  }, [authorSlug, casts]);

  if (!casts) return <div />;

  return (
    <div className={outfit.className}>
      <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
        <Header />
        <div className="max-w-5xl w-full flex flex-col-reverse justify-between mt-4 lg:flex-col">
          <section className="max-w-5xl w-full mt-4">
            <CardList
              title={`${authored.length} published cast${authored.length === 1 ? '' : 's'}.`}
              items={authored}
            />
          </section>
        </div>
      </main>
    </div>
  )
};

export default Profile;
