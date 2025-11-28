import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {use} from 'react';
import { Building2, Zap, TrendingUp, CheckCircle2, BarChart3, Globe } from 'lucide-react';

export default function Page({params}: {params: Promise<{locale: 'pt' | 'en'}>}) {
  const {locale} = use(params);
  const t = useTranslations();
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Plataforma Completa de Pegadas de Carbono
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gradient">
                {t('title')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A ferramenta mais completa e intuitiva para calcular, gerir e reduzir as suas emissões de carbono. 
              Com centenas de fatores de emissão e visualizações detalhadas.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href={`/${locale}/onboarding`} className="btn-primary btn-lg">
                🚀 Começar Agora
              </Link>
              <Link href={`/${locale}/projects`} className="btn-secondary btn-lg">
                📊 Ver Projetos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Como funciona</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Três passos simples para calcular e gerir as suas emissões de forma profissional
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-interactive">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Configurar Projeto</h3>
              <p className="text-slate-600 leading-relaxed">
                Crie a sua organização e defina projetos por região e moeda. O onboarding guia-o através do processo de forma intuitiva.
              </p>
            </div>
            
            <div className="card-interactive">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">2. Registar Atividades</h3>
              <p className="text-slate-600 leading-relaxed">
                Adicione atividades (energia, combustíveis, transportes), selecione fatores de emissão validados e calcule CO₂e automaticamente.
              </p>
            </div>
            
            <div className="card-interactive">
              <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Analisar Resultados</h3>
              <p className="text-slate-600 leading-relaxed">
                Importe despesas via CSV, mapeie categorias e gere relatórios detalhados com visualizações interativas por escopo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Porquê escolher Carboniq?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A ferramenta mais completa do mercado para gestão de pegadas de carbono
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-compact">
              <BarChart3 className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">500+ Fatores de Emissão</h4>
              <p className="text-sm text-slate-600">
                Base de dados extensa com fatores validados e atualizados regularmente
              </p>
            </div>

            <div className="card-compact">
              <Globe className="w-8 h-8 text-cyan-600 mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">Múltiplas Regiões</h4>
              <p className="text-sm text-slate-600">
                Suporte para Portugal, União Europeia e Reino Unido com fatores específicos
              </p>
            </div>

            <div className="card-compact">
              <CheckCircle2 className="w-8 h-8 text-violet-600 mb-3" />
              <h4 className="font-semibold text-slate-900 mb-2">GHG Protocol Compliant</h4>
              <p className="text-sm text-slate-600">
                Segue os padrões internacionais de cálculo de emissões
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
