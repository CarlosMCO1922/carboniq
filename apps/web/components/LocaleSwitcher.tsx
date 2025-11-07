"use client";
import Link from 'next/link';

export function LocaleSwitcher({locale}: {locale: 'pt' | 'en'}) {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
      <Link 
        href="/pt" 
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'pt' 
            ? 'bg-violet-500 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        PT
      </Link>
      <Link 
        href="/en" 
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          locale === 'en' 
            ? 'bg-violet-500 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        EN
      </Link>
    </div>
  );
}
