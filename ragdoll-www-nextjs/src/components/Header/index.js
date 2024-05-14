import Link from 'next/link';
import { Icon } from '@/components';

const Header = () => (
  <header className="z-10 max-w-5xl w-full items-center justify-between text-sm border-b border-slate-800 pb-5 lg:flex">
    <Link href="/" className="block mb-10 lg:mb-0">Ragdoll Studio</Link>
    <nav className="flex gap-1 justify-between lg:gap-16">
      <Link href="/dolls">Dolls</Link>
      <Link href="/feed">Feed</Link>
      <Link href="/apps">Apps</Link>
    </nav>
    <div className="flex justify-center my-2 lg:my-0">
      <Link target="_blank" href="https://github.com/bennyschmidt/ragdoll-studio" className="flex items-center justify-center gap-2 w-full max-w-[16rem] mt-8 px-5 py-3 bg-white text-slate-500 text-center rounded-full lg:max-w-[8rem] lg:mt-0">
        <Icon src="/assets/img/github.svg" />
        <span className="w-auto lg:w-full">Download</span>
      </Link>
    </div>
  </header>
);

export default Header;
