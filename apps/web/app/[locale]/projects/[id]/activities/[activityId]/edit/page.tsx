import Link from 'next/link';
import {notFound} from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function getActivity(id: string) {
  const res = await fetch(`${API}/activities/${id}`, {cache: 'no-store'});
  if (!res.ok) return null;
  return res.json();
}

async function getProject(id: string) {
  const res = await fetch(`${API}/projects/${id}`, {cache: 'no-store'});
  if (!res.ok) return null;
  return res.json();
}

async function getFactors(region: string) {
  const res = await fetch(`${API}/factors?region=${region}&scope=SCOPE2`, {cache: 'no-store'});
  return res.ok ? res.json() : [];
}

export default async function EditActivity({params}: {params: Promise<{locale: string; id: string; activityId: string}>}) {
  const {id, activityId, locale} = await params;
  const a = await getActivity(activityId);
  const p = await getProject(id);
  if (!a || !p) return notFound();
  const factors = await getFactors(p.region);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Editar atividade</h1>
      <form action={`${API}/activities/${activityId}`} method="post">
        <input type="hidden" name="_method" value="PATCH" />
        <div className="grid grid-cols-3 gap-2 max-w-xl">
          <label className="block">Tipo<input name="type" defaultValue={a.type} className="border px-2 py-1 rounded w-full"/></label>
          <label className="block">Quantidade<input name="amount" defaultValue={a.amount} className="border px-2 py-1 rounded w-full"/></label>
          <label className="block">Unidade<input name="unit" defaultValue={a.unit} className="border px-2 py-1 rounded w-full"/></label>
        </div>
        <div className="mt-2 max-w-xl">
          <label className="block">Fator</label>
          <select name="factorId" defaultValue={a.factorId ?? ''} className="border px-2 py-1 rounded w-full">
            <option value="">Nenhum</option>
            {factors.map((f:any)=> <option key={f.id} value={f.id}>{f.code}</option>)}
          </select>
        </div>
        <button className="mt-3 bg-black text-white px-3 py-1 rounded">Guardar</button>
      </form>
      <Link className="underline" href={`/${locale}/projects/${id}`}>Voltar</Link>
    </main>
  );
}
