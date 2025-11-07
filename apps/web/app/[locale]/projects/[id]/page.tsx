import Link from 'next/link';
import {Suspense} from 'react';
import {ProjectActions} from '../../../../components/ProjectActions';
import {ActivitiesTable} from '../../../../components/ActivitiesTable';
import {QuickCreate} from '../../../../components/QuickCreate';
import {SpendMappingsPanel} from '../../../../components/SpendMappingsPanel';
import {ResultsGraphs} from '../../../../components/ResultsGraphs';
import {ImportQuickPanel} from '../../../../components/ImportQuickPanel';
import {DeleteProjectButton} from '../../../../components/DeleteProjectButton';
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function Results({projectId, from, to}: {projectId: string; from?: string; to?: string}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const data = await fetchJSON(`/projects/${projectId}/results${qs.toString() ? `?${qs.toString()}` : ''}`);
  const scope = data.byScope as Record<string, number>;
  const byType = data.byType as Record<string, number>;
  const byMonth = data.byMonth as Record<string, number>;
  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">Por Escopo</h3>
        <table className="w-full text-sm"><tbody>
          {Object.entries(scope).map(([k,v]) => (
            <tr key={k} className="border-b"><td className="py-1">{k}</td><td className="text-right">{v.toFixed(2)} kg</td></tr>
          ))}
        </tbody></table>
      </div>
      <div className="border rounded p-4">
        <h3 className="font-medium mb-2">Por Tipo</h3>
        <table className="w-full text-sm"><tbody>
          {Object.entries(byType).map(([k,v]) => (
            <tr key={k} className="border-b"><td className="py-1">{k}</td><td className="text-right">{v.toFixed(2)} kg</td></tr>
          ))}
        </tbody></table>
      </div>
      <div className="md:col-span-2 border rounded p-4">
        <h3 className="font-medium mb-2">Série Temporal (YYYY-MM)</h3>
        <table className="w-full text-sm"><tbody>
          {Object.entries(byMonth).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => (
            <tr key={k} className="border-b"><td className="py-1">{k}</td><td className="text-right">{v.toFixed(2)} kg</td></tr>
          ))}
        </tbody></table>
      </div>
    </section>
  );
}

async function fetchJSON(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {cache: 'no-store', ...init});
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function Summary({projectId, from, to}: {projectId: string; from?: string; to?: string}) {
  const qs = new URLSearchParams();
  if (from) qs.set('from', from);
  if (to) qs.set('to', to);
  const data = await fetchJSON(`/projects/${projectId}/summary${qs.toString() ? `?${qs.toString()}` : ''}`);
  const s = data.totals.byScope as {SCOPE1: number; SCOPE2: number; SCOPE3: number};
  const total = data.totals.co2e as number;
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 border rounded"><div className="text-sm text-gray-500">Total CO2e</div><div className="text-2xl font-semibold">{total.toFixed(2)} kg</div></div>
      <div className="p-4 border rounded"><div className="text-sm text-gray-500">Escopo 1</div><div className="text-xl">{s.SCOPE1.toFixed(2)} kg</div></div>
      <div className="p-4 border rounded"><div className="text-sm text-gray-500">Escopo 2</div><div className="text-xl">{s.SCOPE2.toFixed(2)} kg</div></div>
      <div className="p-4 border rounded"><div className="text-sm text-gray-500">Escopo 3</div><div className="text-xl">{s.SCOPE3.toFixed(2)} kg</div></div>
    </div>
  );
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
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projeto</h1>
        <div className="flex items-center gap-2 text-sm">
          <form action="" method="get" className="flex items-end gap-2">
            <div>
              <label className="block text-xs">De</label>
              <input className="border px-2 py-1 rounded" type="date" name="from" defaultValue={from} />
            </div>
            <div>
              <label className="block text-xs">Até</label>
              <input className="border px-2 py-1 rounded" type="date" name="to" defaultValue={to} />
            </div>
            <button className="px-3 py-1 border rounded" formMethod="get">Filtrar</button>
          </form>
          <Link className="btn-secondary" href={`/${locale}/onboarding`}>Novo projeto</Link>
          {/* @ts-expect-error Client Component */}
          <DeleteProjectButton projectId={id} />
        </div>
      </div>
      <Suspense fallback={<div>Carregar sumário…</div>}>
        {/* @ts-expect-error Async Server Component */}
        <Summary projectId={id} from={from} to={to} />
      </Suspense>
      {/* Criação rápida de atividades */}
      {/* @ts-expect-error Client Component */}
      <QuickCreate projectId={id} />
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <a className="underline" href={`/${locale}/projects/${id}/activities/new`}>Nova atividade</a>
        <a className="underline" href={`/${locale}/projects/${id}/spend/import`}>Importar e calcular (Spend)</a>
      </div>
      {/* Inline import quick panel can be added later if preferes */}
      {/* Tabela de atividades e ações (Client) */}
      {/* @ts-expect-error Client Component */}
      <ActivitiesTable projectId={id} />
      {/* Results aggregate */}
      {/* @ts-expect-error Async Server Component */}
      <Results projectId={id} from={from} to={to} />
      {/* Graphs (Client) */}
      {/* @ts-expect-error Client Component */}
      <ResultsGraphs projectId={id} from={from} to={to} />
      {/* Client actions */}
      {/* @ts-expect-error Client Component */}
      <ProjectActions projectId={id} />
      {/* Spend mappings inline */}
      {/* @ts-expect-error Client Component */}
      <SpendMappingsPanel projectId={id} />
    </main>
  );
}
