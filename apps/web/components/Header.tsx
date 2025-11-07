"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export function Header({locale}:{locale:'pt'|'en'}){
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-bold tracking-tight text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">carboniq</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors" href={`/${locale}`}>Início</Link>
          <Link className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors" href={`/${locale}/onboarding`}>Onboarding</Link>
          <Link className="px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors" href={`/${locale}/projects`}>Projetos</Link>
        </nav>
      </div>
    </header>
  );
}
