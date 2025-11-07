"use client";
import {useEffect, useState} from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Mapping = {id:string; code:string; factorId:string};

type Props = {projectId:string};

export function SpendMappingsPanel({projectId}:Props){
  const [items,setItems] = useState<Mapping[]>([]);
  const [code,setCode] = useState('OFFICE');
  const [factorId,setFactorId] = useState('');
  const [factors,setFactors] = useState<any[]>([]);

  async function load(){
    const list = await fetch(`${API}/spend/mappings?projectId=${projectId}`).then(r=>r.json());
    setItems(list);
    const fac = await fetch(`${API}/factors?scope=SCOPE3`).then(r=>r.json());
    setFactors(fac);
  }
  useEffect(()=>{ load(); },[projectId]);

  async function add(){
    await fetch(`${API}/spend/mappings`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId, code, factorId})});
    setCode(''); setFactorId('');
    await load();
  }

  return (
    <section className="mt-8 card">
      <h3 className="font-medium mb-3">Mapeamentos de Despesa</h3>
      <div className="flex items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-slate-600">Categoria</label>
          <input className="border px-3 py-2 rounded-lg" value={code} onChange={e=>setCode(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-600">Fator</label>
          <select className="border px-3 py-2 rounded-lg" value={factorId} onChange={e=>setFactorId(e.target.value)}>
            <option value="">Selecione...</option>
            {factors.map((f:any)=>(<option key={f.id} value={f.id}>{f.code}</option>))}
          </select>
        </div>
        <button className="btn-primary" onClick={add}>➕ Adicionar</button>
      </div>
      <ul className="text-sm list-disc pl-5">
        {items.map(i=> (<li key={i.id}>{i.code} → {i.factorId}</li>))}
      </ul>
    </section>
  );
}
