import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function getProjects(){
  const res = await fetch(`${API}/projects`, {cache:'no-store'});
  const ct = res.headers.get('content-type') || '';
  if (!res.ok || !ct.includes('application/json')) {
    const text = await res.text().catch(()=> '');
    throw new Error(`API /projects failed (${res.status}) content-type=${ct} first-chars=${text.slice(0,60)}`);
  }
  return res.json();
}

export default async function ProjectsPage({params}:{params:Promise<{locale:string}>}){
  const {locale} = await params;
  const projects = await getProjects();
  return (
    <main className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projetos</h1>
        <Link className="btn-primary" href={`/${locale}/onboarding`}>➕ Criar novo</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p:any)=> (
          <div key={p.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-slate-600">Região: {p.region} — Moeda: {p.currency}</div>
              </div>
              <Link className="btn-secondary" href={`/${locale}/projects/${p.id}`}>Abrir</Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <form action={`${API}/projects/${p.id}/calculate`} method="post"><button className="btn-primary" formMethod="post">🧮 Calcular todas</button></form>
              <Link className="btn-secondary" href={`/${locale}/projects/${p.id}/activities/new`}>➕ Nova atividade</Link>
              <Link className="btn-accent" href={`/${locale}/projects/${p.id}/spend/import`}>📥 Importar CSV</Link>
              <Link className="btn-secondary" href={`/${locale}/projects/${p.id}/spend/mappings`}>🧭 Mapeamentos spend</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
