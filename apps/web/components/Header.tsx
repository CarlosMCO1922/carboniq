"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { CurrencyToggle } from './CurrencyToggle';

export function Header({locale}:{locale:'pt'|'en'}){
  const path = usePathname();
  
  const isActive = (href: string) => {
    if (href === `/${locale}`) return path === `/${locale}` || path === `/${locale}/`;
    return path?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold tracking-tight text-xl text-gradient">
              carboniq
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(`/${locale}`) 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`} 
              href={`/${locale}`}
            >
              Início
            </Link>
            <Link 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(`/${locale}/projects`) 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`} 
              href={`/${locale}/projects`}
            >
              Projetos
            </Link>
            <Link 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive(`/${locale}/onboarding`) 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`} 
              href={`/${locale}/onboarding`}
            >
              Novo Projeto
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher locale={locale} />
            <CurrencyToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4">
      <Link href="/pt" className="hover:text-slate-900 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
