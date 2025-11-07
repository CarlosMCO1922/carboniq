import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {CurrencyToggle} from '../../components/CurrencyToggle';
import {LocaleSwitcher} from '../../components/LocaleSwitcher';
import {use} from 'react';

export default function Page({params}: {params: Promise<{locale: 'pt' | 'en'}>}) {
  const {locale} = use(params);
  const t = useTranslations();
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600">
              {t('title')}
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para cálculo e gestão de pegadas de carbono empresarial
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href={`/${locale}/onboarding`} className="btn-primary">
              🚀 Começar Agora
            </Link>
            <Link href={`/${locale}/projects`} className="btn-secondary">
              📊 Ver Projetos
            </Link>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <LocaleSwitcher locale={locale} />
          <CurrencyToggle />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Como funciona</h2>
            <p className="text-slate-600">Três passos simples para calcular e gerir as suas emissões</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">1. Configurar Projeto</h3>
              <p className="text-slate-600">Crie a sua organização e defina projetos por região e moeda. O onboarding guia-o através do processo.</p>
            </div>
            
            <div className="card group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">2. Registar Atividades</h3>
              <p className="text-slate-600">Adicione atividades (energia, combustíveis, transportes), selecione fatores de emissão e calcule CO2e automaticamente.</p>
            </div>
            
            <div className="card group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">3. Analisar Resultados</h3>
              <p className="text-slate-600">Importe despesas via CSV, mapeie categorias e gere relatórios detalhados com visualizações por escopo.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
