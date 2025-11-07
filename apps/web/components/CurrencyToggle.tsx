"use client";
import {useCurrency} from './CurrencyProvider';

export function CurrencyToggle() {
  const {currency, setCurrency} = useCurrency();
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => setCurrency('EUR')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currency === 'EUR' 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        EUR
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currency === 'USD' 
            ? 'bg-emerald-500 text-white shadow-sm' 
            : 'text-slate-600 hover:text-slate-800'
        }`}
      >
        USD
      </button>
    </div>
  );
}
