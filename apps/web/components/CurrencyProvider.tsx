"use client";
import {createContext, useContext, useEffect, useMemo, useState} from 'react';

type Currency = 'EUR' | 'USD';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({children}: {children: React.ReactNode}) {
  const [currency, setCurrency] = useState<Currency>('EUR');

  useEffect(() => {
    const saved = window.localStorage.getItem('currency');
    if (saved === 'EUR' || saved === 'USD') setCurrency(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('currency', currency);
  }, [currency]);

  const value = useMemo(() => ({currency, setCurrency}), [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
