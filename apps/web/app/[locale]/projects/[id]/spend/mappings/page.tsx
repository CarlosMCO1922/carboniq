"use client";
import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Mapping = {id:string; code:string; factorId:string; description?:string};

type Factor = {id:string; code:string; scope:'SCOPE1'|'SCOPE2'|'SCOPE3'; region:'PT'|'EU'|'UK'};

export default function SpendMappingsPage(){
  const params = useParams();
  const projectId = String(params?.id||'');
  const [mappings,setMappings] = useState<Mapping[]>([]);
  const [factors,setFactors] = useState<Factor[]>([]);
  const [code,setCode] = useState('OFFICE');
  const [factorId,setFactorId] = useState('');

  useEffect(()=>{
    fetch(`${API}/spend/mappings?projectId=${projectId}`).then(r=>r.json()).then(setMappings);
    // For spend, sugerimos SCOPE3 EUR
    fetch(`${API}/factors?scope=SCOPE3`).then(r=>r.json()).then(setFactors);
  },[projectId]);

  async function addMapping(e:React.FormEvent){
    e.preventDefault();
    await fetch(`${API}/spend/mappings`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({projectId, code, factorId})
    });
    const list = await fetch(`${API}/spend/mappings?projectId=${projectId}`).then(r=>r.json());
    setMappings(list);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Mapeamentos de Despesa</h1>
      <form onSubmit={addMapping} className="flex items-end gap-2 max-w-2xl">
        <div className="flex-1">
          <label className="block text-sm">Categoria (code)</label>
          <input className="border px-2 py-1 rounded w-full" value={code} onChange={e=>setCode(e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="block text-sm">Fator</label>
          <select className="border px-2 py-1 rounded w-full" value={factorId} onChange={e=>setFactorId(e.target.value)}>
            <option value="">Selecione...</option>
            {factors.map(f=> <option key={f.id} value={f.id}>{f.code}</option>)}
          </select>
        </div>
        <button className="bg-black text-white px-3 py-1 rounded">Adicionar</button>
      </form>

      <table className="w-full text-sm">
        <thead><tr className="text-left border-b"><th className="py-2">Categoria</th><th>Fator</th></tr></thead>
        <tbody>
          {mappings.map(m=> (
            <tr key={m.id} className="border-b">
              <td className="py-2">{m.code}</td>
              <td>{m.factorId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
