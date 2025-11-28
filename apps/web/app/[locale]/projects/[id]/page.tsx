import Link from 'next/link';
import {Suspense} from 'react';
import {ProjectActions} from '../../../../components/ProjectActions';
import {ActivitiesTable} from '../../../../components/ActivitiesTable';
import {QuickCreate} from '../../../../components/QuickCreate';
import {SpendMappingsPanel} from '../../../../components/SpendMappingsPanel';
import {EnhancedResultsGraphs} from '../../../../components/EnhancedResultsGraphs';
import {EnhancedSummary} from '../../../../components/EnhancedSummary';
import {ImportQuickPanel} from '../../../../components/ImportQuickPanel';
import {DeleteProjectButton} from '../../../../components/DeleteProjectButton';
import {Breadcrumbs} from '../../../../components/Header';
import {Calendar, Filter} from 'lucide-react';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function fetchJSON(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {cache: 'no-store', ...init});
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function ProjectInfo({projectId}: {projectId: string}) {
  const project = await fetchJSON(`/projects/${projectId}`);
  return project;
}

async function Activities({projectId}: {projectId: string}) {
  const list = await fetchJSON(`/activities?projectId=${projectId}`);
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Atividades</h2>
        <Link className="btn-primary text-sm" href={`./activities/new`}>➕ Nova atividade</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Tipo</th>
              <th>Qtd</th>
              <th>Unidade</th>
              <th>Fator</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a: any) => (
              <tr key={a.id} className="border-b">
                <td className="py-2">{a.type}</td>
                <td>{a.amount}</td>
                <td>{a.unit}</td>
                <td>{a.factorId ?? '-'}</td>
                <td className="space-x-2">
                  <form className="inline" action={`${API}/calculations`} method="post">
                    <input type="hidden" name="activityId" value={a.id} />
                    <button className="btn-secondary text-xs" formMethod="post">🧮 Calcular</button>
                  </form>
                  <Link className="btn-accent text-xs inline-block" href={`./activities/${a.id}/edit`}>✏️ Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <a className="btn-secondary" href={`${API}/projects/${projectId}/export.csv`}>
          ⬇️ Exportar CSV
        </a>
        <form action={`${API}/projects/${projectId}/calculate`} method="post">
          <button className="btn-primary" formMethod="post">🧮 Calcular todas</button>
        </form>
        <Link className="btn-accent" href={`./spend/import`}>📥 Importar CSV (Spend)</Link>
      </div>
    </div>
  );
}

export default async function ProjectPage({params, searchParams}: {params: Promise<{locale: string; id: string}>, searchParams: Promise<Record<string,string>>}) {
  const {id, locale} = await params;
  const sp = await searchParams;
  const from = sp?.from;
  const to = sp?.to;
  
  const project = await fetchJSON(`/projects/${id}`);
  
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Breadcrumbs 
              items={[
                { label: 'Projetos', href: `/${locale}/projects` },
                { label: project.name || 'Projeto' }
              ]} 
            />
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{project.name || 'Projeto'}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
              <span className="badge-muted">{project.region}</span>
              <span className="badge-muted">{project.currency}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link className="btn-secondary" href={`/${locale}/onboarding`}>
              Novo projeto
            </Link>
            {/* @ts-expect-error Client Component */}
            <DeleteProjectButton projectId={id} />
          </div>
        </div>

        {/* Date Filter */}
        <div className="card-compact">
          <form action="" method="get" className="flex items-end gap-4">
            <div className="flex-1">
              <label className="label flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Período
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input 
                    className="input" 
                    type="date" 
                    name="from" 
                    defaultValue={from}
                    placeholder="Data inicial"
                  />
                </div>
                <span className="text-slate-400">até</span>
                <div className="flex-1">
                  <input 
                    className="input" 
                    type="date" 
                    name="to" 
                    defaultValue={to}
                    placeholder="Data final"
                  />
                </div>
                <button className="btn-primary flex items-center gap-2" formMethod="get">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Summary Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Resumo de Emissões</h2>
          {/* @ts-expect-error Client Component */}
          <EnhancedSummary projectId={id} from={from} to={to} />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Ações Rápidas</h2>
          {/* @ts-expect-error Client Component */}
          <QuickCreate projectId={id} />
          <div className="flex items-center gap-3 mt-4 text-sm">
            <Link className="text-emerald-600 hover:text-emerald-700 font-medium" href={`/${locale}/projects/${id}/activities/new`}>
              ➕ Nova atividade
            </Link>
            <span className="text-slate-300">•</span>
            <Link className="text-emerald-600 hover:text-emerald-700 font-medium" href={`/${locale}/projects/${id}/spend/import`}>
              📥 Importar CSV (Spend)
            </Link>
          </div>
        </div>

        {/* Activities Table */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Atividades</h2>
          {/* @ts-expect-error Client Component */}
          <ActivitiesTable projectId={id} />
        </div>

        {/* Visualizations */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Análise e Visualizações</h2>
          {/* @ts-expect-error Client Component */}
          <EnhancedResultsGraphs projectId={id} from={from} to={to} />
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* @ts-expect-error Client Component */}
          <ProjectActions projectId={id} />
          {/* @ts-expect-error Client Component */}
          <SpendMappingsPanel projectId={id} />
        </div>
      </div>
    </main>
  );
}
