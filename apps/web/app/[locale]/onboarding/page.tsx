"use client";
import {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type OrgType = 'B2C' | 'B2B';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as 'pt' | 'en') ?? 'pt';

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const orgName = String(fd.get('orgName') || '').trim();
    const orgType = (fd.get('orgType') as OrgType) || 'B2C';
    const projectName = String(fd.get('projectName') || '').trim();
    const region = (fd.get('region') as 'PT' | 'EU' | 'UK') || 'PT';

    try {
      const org = await fetch(`${API}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName, type: orgType })
      }).then(r => r.json());

      const project = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: org.id, name: projectName, region })
      }).then(r => r.json());

      router.push(`/${locale}/projects/${project.id}`);
    } catch (e) {
      setMessage('Erro ao criar entidades');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="py-10 px-4">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold mb-4">Onboarding</h1>
        <div className="card">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700">Tipo</label>
              <select name="orgType" className="border px-3 py-2 rounded-lg">
                <option value="B2C">B2C</option>
                <option value="B2B">B2B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700">Nome da organização</label>
              <input name="orgName" required className="border px-3 py-2 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Nome do projeto</label>
              <input name="projectName" required className="border px-3 py-2 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Região</label>
              <select name="region" className="border px-3 py-2 rounded-lg">
                <option value="PT">PT</option>
                <option value="EU">EU</option>
                <option value="UK">UK</option>
              </select>
            </div>
            <button disabled={loading} className="btn-primary">
              {loading ? 'A criar…' : 'Criar'}
            </button>
          </form>
          {message && <p className="text-sm mt-3 text-red-600">{message}</p>}
        </div>
      </div>
    </main>
  );
}
